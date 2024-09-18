import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProductFittingsService } from './product-fittings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductFittingDto } from './dto/create-product-fitting.dto';
import { ProductFittingEntity } from './entity/product-fitting.entity';
import { UpdateProductFittingDto } from './dto/update-product-fitting.dto';
import { RemoveManyProductFittingDto } from './dto/removeMany-product-fitting.dto';
import {
  FetchProductFitting,
  MessageWithProductFitting,
  PaginatedProductFitting,
} from 'src/shared/types/productFitting';
import { SearchOption } from 'src';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { Roles } from 'src/auth/role';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/auth/role-guard';

@Controller('product-fittings')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseGuards(JwtAuthGuard)
export class ProductFittingsController {
  constructor(
    private readonly productFittingsService: ProductFittingsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createProductFittingDto: CreateProductFittingDto,
    @Req() req,
  ): Promise<MessageWithProductFitting> {
    createProductFittingDto.createdByUserId = req.user.id;
    createProductFittingDto.updatedByUserId = req.user.id;
    const createdProductFitting = await this.productFittingsService.create(
      createProductFittingDto,
    );
    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductFittingEntity(createdProductFitting),
    };
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  async indexAll(): Promise<FetchProductFitting> {
    const productFittings = await this.productFittingsService.indexAll();
    return {
      status: true,
      message: 'Fetched Successfully!',
      data: productFittings.map(
        (productFitting) => new ProductFittingEntity(productFitting),
      ),
    };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedProductFitting> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };
    const productFittings =
      await this.productFittingsService.findAll(searchOptions);
    return {
      data: productFittings.data.map(
        (productFitting) => new ProductFittingEntity(productFitting),
      ),
      total: productFittings.total,
      page: productFittings.page,
      limit: productFittings.limit,
      totalPages: productFittings.totalPages,
    };
  }
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidateIdExistsPipe('ProductFitting'))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductFittingEntity> {
    const productFitting = await this.productFittingsService.findOne(id);
    return new ProductFittingEntity(productFitting);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductFittingDto: UpdateProductFittingDto,
    @Req() req,
  ): Promise<MessageWithProductFitting> {
    updateProductFittingDto.updatedByUserId = req.user.id;
    updateProductFittingDto.id = id;
    const updatedProductFitting = await this.productFittingsService.update(
      updateProductFittingDto,
    );
    return {
      status: true,
      message: 'Updated Successfully!',
      data: new ProductFittingEntity(updatedProductFitting),
    };
  }
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productFittingsService.remove(id);
  }
  @Delete()
  @Roles(UserRole.ADMIN)
  async removeMany(
    @Body() removeManyProductFittingDto: RemoveManyProductFittingDto,
  ) {
    const result = await this.productFittingsService.removeMany(
      removeManyProductFittingDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
