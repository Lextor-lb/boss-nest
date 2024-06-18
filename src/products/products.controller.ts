import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Get,
  Query,
  Req,
  UseGuards,
  BadRequestException,
  UseFilters,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductPagination, SearchOption } from 'src/shared/types';
import { multerOptions } from 'src/media/multer-config';
import { ProductEntity } from './entity/product.entity';
import { CustomBadRequestExceptionFilter } from 'src/shared/exception/CustomBadRequestExceptionFilter';

@Controller('products')
@UseGuards(JwtAuthGuard)
@UseFilters(CustomBadRequestExceptionFilter)
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No images uploaded', HttpStatus.BAD_REQUEST);
    }

    const imageFiles = files.filter((file) => file.fieldname === 'images');
    if (imageFiles.length === 0) {
      throw new BadRequestException('At least one product image is required');
    }

    createProductDto.imageFilesUrl = imageFiles.map(
      (file) => `/uploads/${file.filename}`,
    );
    createProductDto.createdByUserId = req.user.id;
    createProductDto.updatedByUserId = req.user.id;

    if (createProductDto.productVariants) {
      createProductDto.productVariants.forEach((variant, index) => {
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
        const url = `/uploads/${variantFile.filename}`;
        variant.imageFileUrl = url;
      });
    }

    const product = await this.productService.create(createProductDto);

    return {
      status: true,
      message: 'Created Successfully!',
      // data: product,
      data: new ProductEntity(product),
    };
  }

  // @Get('all')
  // async indexAll() {
  //   const products = await this.productService.indexAll();
  //   return products.map((product) => {
  //     const entity = new ProductEntity(product);
  //     return {
  //       id: entity.id,
  //       name: entity.name,
  //       isArchived: entity.isArchived,
  //     };
  //   });
  // }

  @Get()
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

    const products = await this.productService.findAll(searchOptions);
    return {
      data: products.data.map((product) => new ProductEntity(product)),
      total: products.total,
      page: products.page,
      limit: products.limit,
    };
  }
}
