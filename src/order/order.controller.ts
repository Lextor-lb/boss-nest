import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
  UsePipes,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EcommerceJwtAuthGuard } from 'src/auth/ecommerce-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth';
import { SearchOption } from 'src/shared/types/searchOption';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { Roles } from 'src/auth/role';
import { RolesGuard } from 'src/auth/role-guard';
import { UserRole } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(EcommerceJwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    createOrderDto.ecommerceUserId = req.user.id;
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<any> {
    const searchOptions: SearchOption = {
      page: page || 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search: search || '',
      orderBy: orderBy || 'createdAt',
      orderDirection: orderDirection || 'desc',
    };

    return await this.orderService.findAll(searchOptions);
  }

  @Get('ecommerce')
  @UseGuards(EcommerceJwtAuthGuard)
  findAllEcommerce(@Req() req) {
    return this.orderService.findAllEcommerce(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidateIdExistsPipe('Order'))
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    updateOrderDto.createdByUserId = req.user.id;
    updateOrderDto.updatedByUserId = req.user.id;
    return this.orderService.update(+id, updateOrderDto);
  }

  @Patch('ecommerce/:id')
  @UseGuards(EcommerceJwtAuthGuard)
  @Roles(UserRole.ADMIN)
  updateEcommerce(@Param('id') id: string, @Req() req) {
    return this.orderService.updateEcommerce(+id, req.user.id);
  }
}
