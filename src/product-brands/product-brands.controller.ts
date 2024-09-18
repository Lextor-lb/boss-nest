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
  SearchOption,
  resizeImage,
} from 'src';
import {
  FetchedProductBrand,
  MessageWithProductBrand,
  PaginatedProductBrand,
} from 'src/shared/types/productBrand';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { RolesGuard } from 'src/auth/role-guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/role';
import { MinioService } from 'src/minio/minio.service';
import { FileValidatorPipe } from 'src/shared/pipes/file-validator.pipe';

@Controller('product-brands')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductBrandsController {
  constructor(
    private readonly productBrandsService: ProductBrandsService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile(new FileValidatorPipe()) file: Express.Multer.File,
    @Body() createProductBrandDto: CreateProductBrandDto,
    @Req() req,
  ): Promise<any> {
    const imageUrl = await this.minioService.uploadFile(file);

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
  @Roles(UserRole.ADMIN)
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

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidateIdExistsPipe('ProductBrand'))
  async findOne(@Param('id') id: number): Promise<ProductBrandEntity> {
    const productBrand = await this.productBrandsService.findOne(id);

    return new ProductBrandEntity(productBrand);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductBrandDto: UpdateProductBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<MessageWithProductBrand> {
    let oldImageFileUrl: string | undefined;

    if (file) {
      // Get the old image URL (if you want to delete it later)
      const existingBrand = await this.productBrandsService.findOne(id);
      oldImageFileUrl = existingBrand.media.image()?.split('/').pop(); // Ensure image() is called

      // Upload new image to MinIO
      const imageUrl = await this.minioService.uploadFile(
        file,
        oldImageFileUrl,
      );

      // Set new image URL
      updateProductBrandDto.imageFileUrl = imageUrl;
    }

    // Update the updatedByUserId field with the current user ID
    updateProductBrandDto.updatedByUserId = req.user.id;

    // Update the product brand in the database
    const updatedProductBrand = await this.productBrandsService.update(
      id,
      updateProductBrandDto,
    );

    // Return success response
    return {
      status: true,
      message: 'Updated Successfully!',
      data: new ProductBrandEntity(updatedProductBrand),
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productBrandsService.remove(id);
  }

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
