import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { SpecialEntity } from 'src/specials/entities/special.entity';
import { RemoveManyCustomerDto } from './dto';
import { CustomerPagination, SearchOption } from 'src/shared/types';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.CustomerWhereInput = {
    isArchived: null,
  };

  async analysis() {
    const customers = await this.prisma.customer.findMany({
      where: this.whereCheckingNullClause,
    });

    // total customers
    const total = customers.length;

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

    // Calculate each percentage of AgeRange
    const ageRangePercentages = {
      YOUNG: (ageRangeCounts.YOUNG / total) * 100,
      MIDDLE: (ageRangeCounts.MIDDLE / total) * 100,
      OLD: (ageRangeCounts.OLD / total) * 100,
    };

    // Calculate percentages for each gender
    const genderPercentages = {
      MALE: (genderRangeCounts.Male / total) * 100,
      FEMALE: (genderRangeCounts.Female / total) * 100,
    };

    return {
      totalCustomers: total,
      agePercents: ageRangePercentages,
      genderPercents: genderPercentages,
    };
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const { specialId, createdByUserId, updatedByUserId, ...rest } =
      createCustomerDto;

    const { special, ...customer } = await this.prisma.customer.create({
      data: {
        ...rest,
        special: specialId ? { connect: { id: specialId } } : undefined,
        createdByUser: createdByUserId
          ? { connect: { id: createdByUserId } }
          : undefined,
        updatedByUser: updatedByUserId
          ? { connect: { id: updatedByUserId } }
          : undefined,
      },
      include: {
        special: true,
      },
    });

    return new CustomerEntity({
      ...customer,
      special: special ? new SpecialEntity(special) : null
    });
  }

  // CustomerEntity[]
  async indexAll(): Promise<any> {
    const customers = await this.prisma.customer.findMany({
      where: this.whereCheckingNullClause,
      include: { special: true, Voucher: true },
    });
    return customers.map((customer) => {
      const special = customer.special
        ? new SpecialEntity(customer.special)
        : null;
      const totalVoucher = customer.Voucher.length;
      return new CustomerEntity({
        ...customer,
        special,
        totalVoucher,
        vouchers: undefined,
      });
    });
  }

  // CustomerPagination

  async findAll(searchOptions: SearchOption): Promise<any> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;
    const orderByField = ['id', 'name', 'createdAt'].includes(orderBy)
      ? orderBy
      : 'id';
    const orderDirectionValue = ['asc', 'desc'].includes(
      orderDirection.toLowerCase(),
    )
      ? orderDirection.toLowerCase()
      : 'asc';

    try {
      const total = await this.prisma.customer.count({
        where: {
          ...this.whereCheckingNullClause,
          name: {
            contains: search || '',
            mode: 'insensitive',
          },
        },
      });

      const skip = (page - 1) * limit;

      const customers = await this.prisma.customer.findMany({
        where: {
          ...this.whereCheckingNullClause,
          name: {
            contains: search || '',
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        orderBy: {
          [orderByField]: orderDirectionValue,
        },
        // include: {
        //   special: true,
        //   Voucher: true, // Ensure vouchers are included
        // },
      });

      const totalPages = Math.ceil(total / limit);

      // console.log('Customers found:', customers);

      return customers;
    } catch (error) {
      console.error('Error in findAll method:', error);
      throw new Error('Internal server error');
    }
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
