import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  CustomerEntity,
  CustomerPagination,
  RemoveManyCustomerDto,
  SearchOption,
  SpecialEntity,
} from 'src';
import { createEntityProps } from 'src/shared/utils/createEntityProps';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.CustomerWhereInput = {
    isArchived: null,
  };

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.create({
      data: createCustomerDto,
      include: { special: true }, // Include special
    });
    return new CustomerEntity(createEntityProps(customer));
  }

  async indexAll(): Promise<CustomerEntity[]> {
    // Fetch customers from the database
    const customers = await this.prisma.customer.findMany({
      where: this.whereCheckingNullClause,
      include: { special: true } // Ensure 'special' is included if it exists in the schema
    });
  
    // Map the fetched customers to CustomerEntity instances
    const customerEntities = customers.map(customer => {
      // Destructure the special property and the rest of the customer data
      const { special, specialId, ...customerData } = customer;
  
      // Create a new CustomerEntity instance
      return new CustomerEntity({
        ...customerData,
        special: special ? new SpecialEntity(special) : null // Correct the typo here
      });
    });
  
    // Return the mapped customer entities
    return customerEntities;
  }

  async findAll(searchOptions: SearchOption): Promise<CustomerPagination> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;
  
    // Validate `orderBy` and `orderDirection`
    const validOrderByFields = ['id', 'name', 'createdAt']; // Add valid fields here
    const validOrderDirection = ['asc', 'desc'];
  
    const orderByField = validOrderByFields.includes(orderBy) ? orderBy : 'id'; // Default to 'id' if invalid
    const orderDirectionValue = validOrderDirection.includes(orderDirection.toLowerCase()) ? orderDirection.toLowerCase() as 'asc' | 'desc' : 'asc'; // Default to 'asc' if invalid
  
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
      include: { special: true },
    });
  
    const totalPages = Math.ceil(total / limit);
  
    // Map customers to include special entity
    const mappedCustomers = customers.map((customer) => {
      const { special, specialId, ...customerData } = customer;
      return new CustomerEntity({
        ...customerData,
        special: special ? new SpecialEntity(createEntityProps(special)) : null,
      });
    });
  
    return {
      data: mappedCustomers,
      total,
      page,
      limit,
      totalPages,
    };
  }
  

  async findOne(id: number): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { special: true }, // Include special
    });
  
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }
  
    const { special, ...customerData } = customer;
    return new CustomerEntity({
      ...customerData,
      special: special ? new SpecialEntity(createEntityProps(special)) : null,
    });
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

    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: { special: true }, // Include special
    });
    return new CustomerEntity(createEntityProps(updatedCustomer));
  }

  async remove(id: number): Promise<CustomerEntity> {
    const deletedCustomer = await this.prisma.customer.update({
      where: { id },
      data: {
        isArchived: new Date(),
      },
    });

    return new CustomerEntity(createEntityProps(deletedCustomer));
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
