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
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductCategoryEntity } from './entity/product-category.entity';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { RemoveManyProductCategoryDto } from './dto/removeMany-product-category.dto';

@Controller('product-categories')
@UseGuards(JwtAuthGuard)
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  async create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @Req() req,
  ) {
    const createdByUserId = req.user.id;
    const createdProductCategory = await this.productCategoriesService.create(
      createProductCategoryDto,
      createdByUserId,
    );
    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductCategoryEntity(createdProductCategory),
    };
  }

  @Get('all')
  async indexAll() {
    const productCategories = await this.productCategoriesService.indexAll();
    return productCategories.map((productCategory) => {
      const entity = new ProductCategoryEntity(productCategory);
      return {
        id: entity.id,
        name: entity.name,
        isArchived: entity.isArchived,
      };
    });
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('searchName') searchName?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const productCategories = await this.productCategoriesService.findAll(
      page,
      limit,
      searchName,
      orderBy,
      orderDirection,
    );
    return {
      data: productCategories.data.map(
        (productCategory) => new ProductCategoryEntity(productCategory),
      ),
      total: productCategories.total,
      page: productCategories.page,
      limit: productCategories.limit,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const productCategory = await this.productCategoriesService.findOne(id);
      if (!productCategory) {
        return { status: false, message: 'Product category not found' };
      }
      return new ProductCategoryEntity(productCategory);
    } catch (error) {
      console.error('Error fetching product fitting:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @Req() req,
  ) {
    updateProductCategoryDto.updatedByUserId = req.user.id;
    const updatedProductCategory = await this.productCategoriesService.update(
      id,
      updateProductCategoryDto,
    );
    return {
      status: true,
      message: 'Updated Successfully!',
      data: new ProductCategoryEntity(updatedProductCategory),
    };
  }

  @Delete()
  async removeMany(
    @Body() removeManyProductCategoryDto: RemoveManyProductCategoryDto,
  ) {
    const result = await this.productCategoriesService.removeMany(
      removeManyProductCategoryDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
//commit
