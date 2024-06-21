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
} from 'src';

@Controller('products')
@UseGuards(JwtAuthGuard)
@UseFilters(CustomBadRequestExceptionFilter)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
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

    const product = await this.productsService.create(createProductDto);

    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductEntity(product),
    };
  }

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

    const products = await this.productsService.findAll(searchOptions);
    return {
      totalStock: products.totalStock,
      totalSalePrice: products.totalSalePrice,
      data: products.data.map((product) => new ProductEntity(product)),
      total: products.total,
      page: products.page,
      limit: products.limit,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return new ProductEntity(product);
  }
}
