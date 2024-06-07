import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductTypeEntity } from './entity/product-type.entity';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { RemoveManyProductTypeDto } from './dto/removeMany-product-type.dto';

@Controller('product-types')
@UseGuards(JwtAuthGuard)
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  async create(@Body() createProductTypeDto: CreateProductTypeDto, @Req() req) {
    createProductTypeDto.createdByUserId = req.user.id;
    const createdProductType =
      await this.productTypesService.create(createProductTypeDto);
    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductTypeEntity(createdProductType),
    };
  }

  @Get('all')
  async indexAll() {
    const productTypes = await this.productTypesService.indexAll();
    return productTypes.map(
      (productType) => new ProductTypeEntity(productType),
    );
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('searchName') searchName?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const productTypes = await this.productTypesService.findAll(
      page,
      limit,
      searchName,
      orderBy,
      orderDirection,
    );
    return {
      data: productTypes.data.map(
        (productType) => new ProductTypeEntity(productType),
      ),
      total: productTypes.total,
      page: productTypes.page,
      limit: productTypes.limit,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const productType = await this.productTypesService.findOne(id);
      if (!productType) {
        return { status: false, message: 'Product Type not found' };
      }
      return new ProductTypeEntity(productType);
    } catch (error) {
      console.error('Error fetching product type:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ) {
    updateProductTypeDto.updatedByUserId = req.user.id;
    const updatedProductType = await this.productTypesService.update(
      id,
      updateProductTypeDto,
    );
    return {
      status: true,
      message: 'Updated Successfully!',
      data: new ProductTypeEntity(updatedProductType),
    };
  }

  @Delete()
  async removeMany(@Body() removeManyProductTypeDto: RemoveManyProductTypeDto) {
    const result = await this.productTypesService.removeMany(
      removeManyProductTypeDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
