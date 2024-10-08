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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductTypeEntity } from './entity/product-type.entity';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { RemoveManyProductTypeDto } from './dto/removeMany-product-type.dto';
import { SearchOption } from 'src';
import {
  FetchedProductType,
  MessageWithProductType,
  PaginatedProductType,
} from 'src/shared/types/productType';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createProductTypeDto: CreateProductTypeDto,
    @Req() req,
  ): Promise<MessageWithProductType> {
    createProductTypeDto.createdByUserId = req.user.id;
    const createdProductType =
      await this.productTypesService.create(createProductTypeDto);
    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductTypeEntity(createdProductType),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async indexAll(): Promise<FetchedProductType> {
    const productTypes = await this.productTypesService.indexAll();
    return {
      status: true,
      message: 'Fetched Successfully!',
      data: productTypes.map(
        (productType) => new ProductTypeEntity(productType),
      ),
    };
  }

  @Get('alls')
  async indexAllEcommerce(): Promise<FetchedProductType> {
    const productTypes = await this.productTypesService.indexAllEcommerce();
    return {
      status: true,
      message: 'Fetched Successfully!',
      data: productTypes.map(
        (productType) => new ProductTypeEntity(productType),
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedProductType> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };
    const productTypes = await this.productTypesService.findAll(searchOptions);
    return {
      data: productTypes.data.map(
        (productType) => new ProductTypeEntity(productType),
      ),
      total: productTypes.total,
      page: productTypes.page,
      limit: productTypes.limit,
      totalPages: productTypes.totalPages,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('ProductType'))
  async findOne(@Param('id') id: number): Promise<ProductTypeEntity> {
    const productType = await this.productTypesService.findOne(id);
    return new ProductTypeEntity(productType);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ): Promise<MessageWithProductType> {
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productTypesService.remove(id);
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
