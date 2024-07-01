import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SearchOption, CustomerPagination } from 'src/shared/types';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = await this.prisma.customer.create({
      data: createCustomerDto,
      include: { special: true }, // Include special
    });
    return new CustomerEntity(customer);
  }

  async findAll(searchOptions: SearchOption): Promise<CustomerPagination> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;

    const [total, customers] = await this.prisma.$transaction([
      this.prisma.customer.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      this.prisma.customer.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [orderBy]: orderDirection,
        },
        include: { special: true }, // Include special
      }),
    ]);
    const totalPages = Math.ceil(total / limit);

    return {
      data: customers.map((customer) => new CustomerEntity(customer)),
      page,
      limit,
      total,
      totalPages,
    };
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { special: true }, // Include special
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return new CustomerEntity(customer);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    const customer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: { special: true }, // Include special
    });

    return new CustomerEntity(customer);
  }

  async remove(id: number) {
    await this.findOne(id);

    const customer = await this.prisma.customer.delete({
      where: { id },
      include: { special: true }, // Include special
    });

    return new CustomerEntity(customer);
  }
}
