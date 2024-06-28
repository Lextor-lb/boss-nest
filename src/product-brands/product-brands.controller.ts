import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';

import {
  UpdateProductBrandDto,
  RemoveManyProductBrandDto,
  JwtAuthGuard,
  ProductBrandEntity,
  CreateProductBrandDto,
  ProductBrandsService,
  multerOptions,
  SearchOption,
} from 'src';
import { FileValidatorPipe } from 'src/shared/pipes/file-validator.pipe';
import {
  FetchedProductBrand,
  MessageWithProductBrand,
  PaginatedProductBrand,
} from 'src/shared/types/productBrand';

@Controller('product-brands')
@UseGuards(JwtAuthGuard)
export class ProductBrandsController {
  constructor(private readonly productBrandsService: ProductBrandsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @Body() createProductBrandDto: CreateProductBrandDto,
    @UploadedFile(new FileValidatorPipe()) file: Express.Multer.File,
    @Req() req,
  ): Promise<MessageWithProductBrand> {
    createProductBrandDto.createdByUserId = req.user.id;
    createProductBrandDto.updatedByUserId = req.user.id;
    createProductBrandDto.imageFileUrl = `/uploads/${file.filename}`;
    const createdProductBrand = await this.productBrandsService.create(
      createProductBrandDto,
    );

    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductBrandEntity(createdProductBrand),
    };
  }

  @Get('all')
  async indexAll(): Promise<FetchedProductBrand> {
    const productBrands = await this.productBrandsService.indexAll();
    return {
      status: true,
      message: 'Fetched Successfully!',
      data: productBrands.map(
        (productBrand) => new ProductBrandEntity(productBrand),
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
  ): Promise<PaginatedProductBrand> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };
    const productBrands =
      await this.productBrandsService.findAll(searchOptions);

    return {
      data: productBrands.data.map((pb) => new ProductBrandEntity(pb)),
      total: productBrands.total,
      page: productBrands.page,
      limit: productBrands.limit,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductBrandEntity> {
    const productBrand = await this.productBrandsService.findOne(id);

    return new ProductBrandEntity(productBrand);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductBrandDto: UpdateProductBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<MessageWithProductBrand> {
    if (file) {
      updateProductBrandDto.imageFileUrl = `/uploads/${file.filename}`;
    }
    updateProductBrandDto.updatedByUserId = req.user.id;
    const updatedProductBrand = await this.productBrandsService.update(
      id,
      updateProductBrandDto,
    );

    return {
      status: true,
      message: 'Updated Successfully!',
      data: new ProductBrandEntity(updatedProductBrand),
    };
  }

  @Delete()
  async removeMany(
    @Body() removeManyProductBrandDto: RemoveManyProductBrandDto,
  ) {
    const result = await this.productBrandsService.removeMany(
      removeManyProductBrandDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
