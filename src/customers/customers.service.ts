import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AgeRange, CustomerGender, Prisma } from '@prisma/client';
import * as ExcelJs from "exceljs";
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { SpecialEntity } from 'src/specials/entities/special.entity';
import { RemoveManyCustomerDto } from './dto';
import { Response } from 'express';
import { SearchOption } from 'src/shared/types';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.CustomerWhereInput = {
    isArchived: null,
  };

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const { specialId, createdByUserId, updatedByUserId, dateOfBirth, ...rest } = createCustomerDto;
  
    const customerData = {
      ...rest,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, // Convert string to Date
      special: specialId ? { connect: { id: specialId } } : undefined,
      createdByUser: createdByUserId ? { connect: { id: createdByUserId } } : undefined,
      updatedByUser: updatedByUserId ? { connect: { id: updatedByUserId } } : undefined,
    };
  
    const { special, ...customer } = await this.prisma.customer.create({
      data: customerData,
      include: {
        special: true,
      },
    });
  
    return new CustomerEntity({
      ...customer,
      special: special ? new SpecialEntity(special) : null,
    });
  }  

  async importCustomersFromExcel(file: Express.Multer.File, req: any): Promise<string>{
    if(!file || file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      throw new BadRequestException('Invalid file format. Please upload an Excel file.');
    }

    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.getWorksheet(1);

    const customers = [];
    worksheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
      // Assuming the Excel has a structure like:
      // ID | Name | Phone Number | Email | Gender | Age Range | Special ID | Address | Remark
      if (rowNumber > 1) { // Skip header row
        const genderValue = row.getCell(5).value.toString();
        const ageRangeValue = row.getCell(6).value.toString();
      
        // Validate and check if the value exists in the Gender enum
        if (!Object.values(CustomerGender).includes(genderValue as CustomerGender)) {
          throw new Error(`Invalid gender value: ${genderValue}`);
        }
      
        // Validate and check if the value exists in the AgeRange enum
        if (!Object.values(AgeRange).includes(ageRangeValue as AgeRange)) {
          throw new Error(`Invalid age range value: ${ageRangeValue}`);
        }
      
        const customerData: CreateCustomerDto = {
          name: row.getCell(2).value.toString(),
          phoneNumber: row.getCell(3).value.toString(),
          email: row.getCell(4).value ? row.getCell(4).value.toString() : null,
          gender: genderValue as CustomerGender, // Ensure valid enum assignment
          ageRange: ageRangeValue as AgeRange, // Ensure valid enum assignment
          dateOfBirth: row.getCell(7).value ? new Date(row.getCell(7).value.toString()).toISOString() : null,
          specialId: parseInt(row.getCell(8).value.toString(), 10),
          address: row.getCell(9).value ? row.getCell(9).value.toString() : null,
          remark: row.getCell(10).value ? row.getCell(10).value.toString() : null,
          createdByUserId: req.user.id, // Set the user's ID
          updatedByUserId: req.user.id, // Set the user's ID
        };
      
        customers.push(customerData);
      }
    })

    // Bulk create customers in the database
    await this.prisma.customer.createMany({
      data: customers,
    });

    return `${customers.length} customers have been imported successfully.`;
  }

  async exportCustomersToExcel(searchOptions: SearchOption, res: Response): Promise<void> {
    try {
      const customers = await this.findAll(searchOptions);  // Fetch customers from your findAll method

      // Create a new workbook and worksheet
      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet('Customers');

      // Define columns
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Phone Number', key: 'phoneNumber', width: 20 },
        { header: 'Special', key: 'specialTitle', width: 15 },
        { header: 'Total Voucher', key: 'totalVoucher', width: 15 },
      ];

      // Add rows to the worksheet
      customers.customers.forEach((customer) => {
        worksheet.addRow({
          id: customer.id,
          name: customer.name,
          phoneNumber: customer.phoneNumber,
          specialTitle: customer.specialTitle,
          totalVoucher: customer.totalVoucher,
        });
      });

      // Set the response headers for downloading the file
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');

      // Write the workbook to the response stream
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      throw new Error('Error generating Excel file');
    }
  }

  // CustomerEntity[]
  async findAll(searchOptions: SearchOption): Promise<any> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;
    const orderByField = ['id', 'name', 'createdAt','phoneNumber'].includes(orderBy)
      ? orderBy
      : 'id';
    const orderDirectionValue = ['asc', 'desc'].includes(
      orderDirection.toLowerCase(),
    )
      ? orderDirection.toLowerCase()
      : 'asc';

    try {
      // Count total customers based on search criteria
      const total = await this.prisma.customer.count({
        where: {
          ...this.whereCheckingNullClause,
          OR: [
            { name: { contains: search || '', mode: 'insensitive'}},
            { phoneNumber: {contains: search || '', mode: 'insensitive'}},
            { special: {name: {contains: search || '', mode: 'insensitive'}}}
          ]
        },
      });

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Fetch customers with pagination, search, and sorting
      const customers = await this.prisma.customer.findMany({
        where: {
          ...this.whereCheckingNullClause,
          OR: [
            {
              name: { contains: search, mode: 'insensitive' },
            },
            {
              phoneNumber: { contains: search, mode: 'insensitive' },
            },
            {
              special: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          [orderByField]: orderDirectionValue,
        },
        include: {
          special: true,
          Voucher: true,
        },
      });

      // Map over customers to add specialTitle, totalVoucher, and voucher transformations
      const modifiedCustomers = customers.map((customer) => {
        const special = customer.special
          ? new SpecialEntity(customer.special)
          : null;

        const specialTitle = special ? special.name : null;
        const totalVoucher = customer.Voucher.length;

        return new CustomerEntity({
          ...customer,
          special,
          specialTitle,
          totalVoucher,
          vouchers: customer.Voucher,
        });
      });

      // Sort the customers by totalPrice if requested
      if (orderBy === 'totalPrice') {
        modifiedCustomers.sort((a, b) => 
        {
          if (orderDirectionValue === 'asc') {
            return a.totalPrice - b.totalPrice;
          } else {
            return b.totalPrice - a.totalPrice;
          }
        });
      }

      // Perform the analysis
      const ageRangeCounts = {
        YOUNG: 0,
        MIDDLE: 0,
        OLD: 0,
      };

      const genderRangeCounts = {
        Male: 0,
        Female: 0,
      };

      customers.forEach((customer) => {
        if (customer.ageRange in ageRangeCounts) {
          ageRangeCounts[customer.ageRange]++;
        }
        if (customer.gender in genderRangeCounts) {
          genderRangeCounts[customer.gender]++;
        }
      });

      const ageRangePercentages = {
        YOUNG: Math.ceil((ageRangeCounts.YOUNG / total) * 100),
        MIDDLE: Math.ceil((ageRangeCounts.MIDDLE / total) * 100),
        OLD: Math.ceil((ageRangeCounts.OLD / total) * 100),
      };

      const genderPercentages = {
        MALE: Math.ceil((genderRangeCounts.Male / total) * 100),
        FEMALE: Math.ceil((genderRangeCounts.Female / total) * 100),
      };

      const analysis = {
        totalCustomers: total,
        agePercents: ageRangePercentages,
        genderPercents: genderPercentages,
      };

      const totalPages = Math.ceil(total / limit);

      return {
        customers: modifiedCustomers,
        analysis,
        page,
        limit,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error in indexAll method:', error);
      throw new Error('Internal server error');
    }
  }

  async indexAll(): Promise<any> {
    const customers = await this.prisma.customer.findMany({
      where: this.whereCheckingNullClause,
      include: {
        special: true,
      },
    });

    if (customers.length == 0) {
      return "There's no customer!";
    }

    // Transform the raw customer data into instances of CustomerEntity
    return customers.map((customer) => {
      return new CustomerEntity({
        ...customer,
        specialTitle: customer.special?.name, // Assign specialTitle from special.name
      });
    });
  }

  async findOne(id: number): Promise<any> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { special: true, Voucher: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }
    // const totalVoucher = Voucher.length;
    // const vouchersArray = Object.values(Voucher);

    // const totalPrice = vouchersArray.reduce(
    //   (sum, voucher) => sum + (voucher.total || 0),
    //   0,
    // );

    // return customer;
    const vouchers = customer.Voucher;
    const special = customer.special
      ? new SpecialEntity(customer.special)
      : null;
    return new CustomerEntity({ ...customer, special, vouchers });
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }

    const customer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: { special: true }, // Include special
    });

    const special = customer.special
      ? new SpecialEntity(customer.special)
      : null;
    return new CustomerEntity({ ...customer, special });
  }

  async remove(id: number): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        isArchived: new Date(),
      },
      include: { special: true },
    });

    const special = customer.special
      ? new SpecialEntity(customer.special)
      : null;
    return new CustomerEntity({ ...customer, special });
  }

  async removeMany(removeManyCustomerDto: RemoveManyCustomerDto) {
    const { ids } = removeManyCustomerDto;

    const { count } = await this.prisma.customer.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    return {
      status: true,
      message: `Customers with ids count of ${count} have been deleted successfully.`,
      archivedIds: ids,
    };
  }
}
