import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  CustomerEntity,
  CustomerPagination,
  SearchOption,
  MessageWithCustomer,
  JwtAuthGuard,
  RemoveManyCustomerDto,
  FetchedCustomerWithAnalysis,
} from 'src';
import { RolesGuard } from 'src/auth/role-guard';
import { Roles } from 'src/auth/role';
import { UserRole } from '@prisma/client';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // @Get('analysis')
  // async analysis() {
  //   const result = await this.customersService.analysis();

  //   return {
  //     status: true,
  //     message: 'Fetched Successfully',
  //     data: result,
  //   };
  // }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createCustomerDto: CreateCustomerDto, @Req() req) {
    createCustomerDto.createdByUserId = req.user.id;
    createCustomerDto.updatedByUserId = req.user.id;
    return this.customersService.create(createCustomerDto);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  async indexAll(@Req() req): Promise<FetchedCustomerWithAnalysis> {
    const { page, limit, search, orderBy, orderDirection } = req.query;
    const searchOptions: SearchOption = {
      page: parseInt(page, 10) || 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search: search || '',
      orderBy: orderBy || 'id',
      orderDirection: orderDirection || 'ASC',
    };

    const {
      customers,
      analysis,
      page: customersPage,
      limit: customersLimit,
      total,
      totalPages,
    } = await this.customersService.indexAll(searchOptions);

    return {
      status: true,
      message: 'Fetched Successfully!',
      data: customers,
      analysis, // Include the analysis results in the response
      page: customersPage,
      limit: customersLimit,
      total,
      totalPages,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Req() req): Promise<CustomerPagination> {
    try {
      const { page, limit, search, orderBy, orderDirection } = req.query;
      const searchOptions: SearchOption = {
        page: parseInt(page, 10) || 1,
        limit: limit ? parseInt(limit, 10) : 10,
        search: search || '',
        orderBy: orderBy || 'id',
        orderDirection: orderDirection || 'ASC',
      };

      const customers = await this.customersService.findAll(searchOptions);

      return {
        data: customers,
        page: customers.page,
        limit: customers.limit,
        total: customers.total,
        totalPages: customers.totalPages,
      };
    } catch (error) {
      console.error('Error in findAll method:', error);
      throw new Error('Internal server error');
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customersService.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return new CustomerEntity(customer);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<MessageWithCustomer> {
    updateCustomerDto.updatedByUserId = req.user.id;
    const updatedCustomer = await this.customersService.update(
      id,
      updateCustomerDto,
    );
    return {
      status: true,
      message: 'Updated Successfully!',
      data: new CustomerEntity(updatedCustomer),
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageWithCustomer> {
    const result = await this.customersService.remove(id);
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: new CustomerEntity(result),
    };
  }

  @Delete()
  @Roles(UserRole.ADMIN)
  async removeMany(@Body() removeManyCustomerDto: RemoveManyCustomerDto) {
    const result = await this.customersService.removeMany(
      removeManyCustomerDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
