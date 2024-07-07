import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  CustomerEntity,
  CustomerPagination,
  RemoveManyCustomerDto,
  SearchOption,
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
    const customers = await this.prisma.customer.findMany({
      where: this.whereCheckingNullClause,
    });

    return customers.map(
      (customer) => new CustomerEntity(createEntityProps(customer)),
    );
  }

  async findAll(searchOptions: SearchOption): Promise<CustomerPagination> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;

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
        [orderBy]: orderDirection.toLowerCase() as 'asc' | 'desc', // Convert to lowercase and type assertion
      },
      include: { special: true }, // Include special
    });

    const totalPages = Math.ceil(total / limit);

    // Map customers using the createEntityProps function if necessary
    const mappedCustomers = customers.map(
      (customer) => new CustomerEntity(createEntityProps(customer)),
    );

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

    return new CustomerEntity(createEntityProps(customer));
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
