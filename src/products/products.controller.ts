import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CustomBadRequestExceptionFilter } from 'src/shared/exception/CustomBadRequestExceptionFilter';
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Query,
  Req,
  UseGuards,
  BadRequestException,
  UseFilters,
  Param,
  ParseIntPipe,
  Delete,
  Put,
  UsePipes,
} from '@nestjs/common';
import {
  ProductVariantsService,
  ProductEntity,
  multerOptions,
  ProductsService,
  CreateProductDto,
  ProductPagination,
  SearchOption,
  JwtAuthGuard,
  resizeImage,
} from 'src';
import { ProductDetailEntity } from './entity/productDetail.entity';
import { RemoveManyProductDto } from './dto/removeMany-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { MinioService } from 'src/minio/minio.service';
import { RolesGuard } from 'src/auth/role-guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/role';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(CustomBadRequestExceptionFilter)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly minioService: MinioService, // Inject MinioService
  ) {}
  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(AnyFilesInterceptor()) // Use AnyFilesInterceptor for multiple file uploads
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    const imageFiles = files.filter((file) => file.fieldname === 'images');

    if (imageFiles.length === 0) {
      throw new BadRequestException('At least one product image is required');
    }

    // Upload images to MinIO and store the URLs
    createProductDto.imageFilesUrl = await Promise.all(
      imageFiles.map(async (file) => {
        const imageUrl = await this.minioService.uploadFile(file); // Upload to MinIO
        return imageUrl; // Save the MinIO URL
      }),
    );

    createProductDto.createdByUserId = req.user.id;
    createProductDto.updatedByUserId = req.user.id;

    // Handle product variants with image uploads
    if (createProductDto.productVariants) {
      for (const [
        index,
        variant,
      ] of createProductDto.productVariants.entries()) {
        variant.createdByUserId = req.user.id;
        variant.updatedByUserId = req.user.id;

        const variantFile = files.find(
          (file) => file.fieldname === `productVariants[${index}][image]`,
        );

        if (!variantFile) {
          throw new BadRequestException(
            `Image file for product variant at index ${index} is missing`,
          );
        }

        // Upload variant image to MinIO
        const variantImageUrl = await this.minioService.uploadFile(variantFile);
        variant.imageFileUrl = variantImageUrl; // Save MinIO URL for the variant image
      }
    }

    const product = await this.productsService.create(createProductDto);
    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductEntity(product),
    };
  }

  // @Post()
  // @UseInterceptors(AnyFilesInterceptor('image'))
  // async create(
  //   @Body() createProductDto: CreateProductDto,
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Req() req,
  // ) {
  //   if (!files || files.length === 0) {
  //     throw new BadRequestException('No images uploaded');
  //   }

  //   const imageFiles = files.filter((file) => file.fieldname === 'images');

  //   if (imageFiles.length === 0) {
  //     throw new BadRequestException('At least one product image is required');
  //   }

  //   createProductDto.imageFilesUrl = await Promise.all(
  //     imageFiles.map(async (file) => {
  //       await resizeImage(file.path);
  //       return `/uploads/${file.filename}`;
  //     }),
  //   );
  //   createProductDto.createdByUserId = req.user.id;
  //   createProductDto.updatedByUserId = req.user.id;

  //   if (createProductDto.productVariants) {
  //     for (const [
  //       index,
  //       variant,
  //     ] of createProductDto.productVariants.entries()) {
  //       variant.createdByUserId = req.user.id;
  //       variant.updatedByUserId = req.user.id;
  //       const variantFile = files.find(
  //         (file) => file.fieldname === `productVariants[${index}][image]`,
  //       );
  //       if (!variantFile) {
  //         throw new BadRequestException(
  //           `Image file for product variant at index ${index} is missing`,
  //         );
  //       }
  //       await resizeImage(variantFile.path); // Resize variant image
  //       variant.imageFileUrl = `/uploads/${variantFile.filename}`;
  //     }
  //   }
  //   const product = await this.productsService.create(createProductDto);
  //   return {
  //     status: true,
  //     message: 'Created Successfully!',
  //     data: new ProductEntity(product),
  //   };
  // }
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(AnyFilesInterceptor()) // Use AnyFilesInterceptor for multiple file uploads
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ): Promise<any> {
    const imageFiles = files.filter((file) => file.fieldname === 'images');

    // Upload new images to MinIO and store the URLs
    updateProductDto.imageFilesUrl = await Promise.all(
      imageFiles.map(async (file) => {
        const imageUrl = await this.minioService.uploadFile(file); // Upload to MinIO
        return imageUrl; // Save the MinIO URL
      }),
    );

    updateProductDto.updatedByUserId = req.user.id;

    return await this.productsService.update(id, updateProductDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<ProductPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    const products = await this.productsService.findAll(searchOptions);
    return {
      totalStock: products.totalStock,
      totalSalePrice: products.totalSalePrice,
      data: products.data.map((product) => new ProductEntity(product)),
      total: products.total,
      page: products.page,
      limit: products.limit,
      totalPages: products.totalPages,
    };
  }
  // @Put(':id')
  // @UseInterceptors(AnyFilesInterceptor(multerOptions))
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateProductDto: UpdateProductDto,
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Req() req,
  // ): Promise<any> {
  //   const imageFiles = files.filter((file) => file.fieldname === 'images');
  //   updateProductDto.imageFilesUrl = await Promise.all(
  //     imageFiles.map(async (file) => {
  //       await resizeImage(file.path);
  //       return `/uploads/${file.filename}`;
  //     }),
  //   );
  //   updateProductDto.updatedByUserId = req.user.id;
  //   return await this.productsService.update(id, updateProductDto);
  // }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidateIdExistsPipe('Product'))
  async findOne(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);
    return new ProductDetailEntity(product);
  }

  @Delete('media/:id')
  @Roles(UserRole.ADMIN)
  async removeProductMedia(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.removeProductMedia(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }

  @Delete()
  @Roles(UserRole.ADMIN)
  async removeMany(@Body() removeManyProductTypeDto: RemoveManyProductDto) {
    const result = await this.productsService.removeMany(
      removeManyProductTypeDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
