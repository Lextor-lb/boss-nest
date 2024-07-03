import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity, CustomerPagination, SearchOption } from 'src';

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
  
    const total = await this.prisma.customer.count({
      where: {
        name: {
          contains: search || '',
          mode: 'insensitive',
        },
      },
    });
  
    const skip = (page - 1) * limit;
  
    const customers = await this.prisma.customer.findMany({
      where: {
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
  
    return {
      data: customers.map(
        (customer) => new CustomerEntity(customer),
      ),
      total,
      page,
      limit,
    };
  }
  

  async findOne(id: number): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { special: true }, // Include special
    });
    return new CustomerEntity(customer);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerEntity> {
    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: { special: true }, // Include special
    });
    return new CustomerEntity(updatedCustomer);
  }

  async remove(id: number): Promise<CustomerEntity> {
    const deletedCustomer = await this.prisma.customer.delete({
      where: { id },
      include: { special: true }, // Include special
    });
    return new CustomerEntity(deletedCustomer);
  }
}