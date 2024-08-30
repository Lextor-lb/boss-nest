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
import {
  ProductCategoriesService,
  CreateProductCategoryDto,
  JwtAuthGuard,
  RemoveManyProductCategoryDto,
  UpdateProductCategoryDto,
  ProductCategoryEntity,
  SearchOption,
} from 'src';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import {
  FetchProductCategory,
  MessageWithProductCategory,
  PaginatedProductCategory,
} from 'src/shared/types/productCategory';

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
  ): Promise<MessageWithProductCategory> {
    createProductCategoryDto.createdByUserId = req.user.id;
    createProductCategoryDto.updatedByUserId = req.user.id;
    const createdProductCategory = await this.productCategoriesService.create(
      createProductCategoryDto,
    );
    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductCategoryEntity(createdProductCategory),
    };
  }
  @Get('all')
  async indexAll(): Promise<FetchProductCategory> {
    const productCategories = await this.productCategoriesService.indexAll();
    return {
      status: true,
      message: 'Fetched Successfully!',
      data: productCategories.map(
        (productCategory) => new ProductCategoryEntity(productCategory),
      ),
    };
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedProductCategory> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };
    const productCategories =
      await this.productCategoriesService.findAll(searchOptions);
    return {
      data: productCategories.data.map(
        (productCategory) => new ProductCategoryEntity(productCategory),
      ),
      total: productCategories.total,
      page: productCategories.page,
      limit: productCategories.limit,
      totalPages: productCategories.totalPages,
    };
  }

  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('ProductCategory'))
  async findOne(@Param('id') id: number): Promise<ProductCategoryEntity> {
    const productCategory = await this.productCategoriesService.findOne(id);
    return new ProductCategoryEntity(productCategory);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @Req() req,
  ): Promise<MessageWithProductCategory> {
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productCategoriesService.remove(id);
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
