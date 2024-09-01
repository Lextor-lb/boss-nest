import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  Get,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  Query,
  UsePipes,
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
  resizeImage,
} from 'src';
import { FileValidatorPipe } from 'src/shared/pipes/file-validator.pipe';
import {
  FetchedProductBrand,
  MessageWithProductBrand,
  PaginatedProductBrand,
} from 'src/shared/types/productBrand';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { RolesGuard } from 'src/auth/role-guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/role';
import { EcommerceJwtAuthGuard } from 'src/auth/ecommerce-jwt-auth.guard';
import { MinioService } from 'src/minio/minio.service';

@Controller('product-brands')
export class ProductBrandsController {
  constructor(
    private readonly productBrandsService: ProductBrandsService,
    private readonly minioService: MinioService,
  ) {}

  // @UseGuards(JwtAuthGuard, RolesGuard, EcommerceJwtAuthGuard)
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard, EcommerceJwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductBrandDto: CreateProductBrandDto,
    @Req() req,
  ): Promise<any> {
    if (!file || !file.buffer) {
      throw new Error('File is missing or not processed correctly');
    }

    const bucketName = process.env.MINIO_BUCKET_NAME;
    const imageUrl = await this.minioService.uploadFile(bucketName, file);

    // Continue with processing createProductBrandDto
    createProductBrandDto.createdByUserId = req.user.id;
    createProductBrandDto.updatedByUserId = req.user.id;
    createProductBrandDto.imageFileUrl = imageUrl;

    const createdProductBrand = await this.productBrandsService.create(
      createProductBrandDto,
    );

    return {
      status: true,
      message: 'Created Successfully!',
      data: createdProductBrand,
    };
  }

  @Get('all')
  // @UseGuards(JwtAuthGuard, EcommerceJwtAuthGuard, RolesGuard)
  // @Roles(UserRole.STAFF, UserRole.ADMIN)
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

  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles(UserRole.ADMIN)
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
      totalPages: productBrands.totalPages,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidateIdExistsPipe('ProductBrand'))
  async findOne(@Param('id') id: number): Promise<ProductBrandEntity> {
    const productBrand = await this.productBrandsService.findOne(id);

    return new ProductBrandEntity(productBrand);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductBrandDto: UpdateProductBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<MessageWithProductBrand> {
    if (file) {
      await resizeImage(file.path);
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productBrandsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @Roles(UserRole.ADMIN)
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
