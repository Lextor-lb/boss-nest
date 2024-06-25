import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  CustomerEntity,
  CustomerPagination,
  SearchOption,
  MessageWithCustomer
} from 'src';

import {
  ParseIntPipe
} from '@nestjs/common';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Req() req):{
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll(): Promise<CustomerPagination> {
    const searchOptions: SearchOption = {
       page,
       limit: limit ? parseInt(limit, 10) : 10,
       search,
       orderBy,
       orderDirection
    };
    const customers = this.customersService.findAll(searchOptions);
    return {
      data: customers.data.map((customer) => new CustomerEntity(customer)),
      page: customers.page,
      limit: customers.limit
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customersService.findOne(+id);
    return new CustomerEntity(customer);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string,@Req() req, @Body() updateCustomerDto: UpdateCustomerDto): Promise<MessageWithCustomer> {
    updateCustomerDto.updatedByUserId = req.user.id;
    const updatedCustomer = await this.
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
