import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity, CustomerPagination, SearchOption, MessageWithCustomer } from 'src';
import { ParseIntPipe } from '@nestjs/common';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Req() req) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll(@Req() req): Promise<CustomerPagination> {
    try {
      const { page, limit, search, orderBy, orderDirection } = req.query;
      const searchOptions: SearchOption = {
        page: parseInt(page, 10) || 1,
        limit: limit ? parseInt(limit, 10) : 10,
        search: search || '',
        orderBy: orderBy || 'id',
        orderDirection: orderDirection || 'ASC'
      };

      console.log('Search options:', searchOptions);  // Add logging to see search options

      const customers = await this.customersService.findAll(searchOptions);
      console.log('Customers data:', customers);  // Add logging to see returned customers

      return {
        data: customers.data.map((customer) => new CustomerEntity(customer)),
        page: customers.page,
        limit: customers.limit,
        total: customers.total,
      };
    } catch (error) {
      console.error('Error in findAll method:', error);  // Log the error
      throw new Error('Internal server error');
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customersService.findOne(id);
    return new CustomerEntity(customer);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<MessageWithCustomer> {
    updateCustomerDto.updatedByUserId = req.user.id;
    const updatedCustomer = await this.customersService.update(id, updateCustomerDto);
    return {
      status: true,
      message: 'Updated Successfully!',
      data: new CustomerEntity(updatedCustomer)
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<MessageWithCustomer> {
    const result = await this.customersService.remove(id);
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: new CustomerEntity(result),
    };
  }
}
