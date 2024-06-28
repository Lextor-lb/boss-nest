import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity, CustomerPagination, SearchOption } from 'src';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.create({
      data: createCustomerDto,
    });
    return new CustomerEntity(customer);
  }

  async findAll(searchOptions: SearchOption): Promise<CustomerPagination> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;

    // Assuming Prisma client has a method to fetch data with pagination
    const customers = await this.prisma.customer.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: {
          contains: search,
        },
      },
      orderBy: {
        [orderBy]: orderDirection,
      },
    });

    const total = await this.prisma.customer.count({
      where: {
        name: {
          contains: search,
        },
      },
    });

    return {
      data: customers,
      page,
      limit,
      total,
    };
  }

  async findOne(id: number): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    return new CustomerEntity(customer);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
    return new CustomerEntity(customer);
  }

  async remove(id: number): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.delete({
      where: { id },
    });
    return new CustomerEntity(customer);
  }
}