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

    if (imageFiles.length === 0) 
    {
      throw new BadRequestException('At least one product image is required');
    }

    createProductDto.imageFilesUrl = await Promise.all(
      imageFiles.map(async (file) => {
        await resizeImage(file.path);
        return `/uploads/${file.filename}`;
      }),
    );
    createProductDto.createdByUserId = req.user.id;
    createProductDto.updatedByUserId = req.user.id;

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
        await resizeImage(variantFile.path); // Resize variant image
        variant.imageFileUrl = `/uploads/${variantFile.filename}`;
      }
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
      totalPages: products.totalPages,
    };
  }
  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ): Promise<any> {
    const imageFiles = files.filter((file) => file.fieldname === 'images');
    updateProductDto.imageFilesUrl = await Promise.all(
      imageFiles.map(async (file) => {
        await resizeImage(file.path);
        return `/uploads/${file.filename}`;
      }),
    );
    updateProductDto.updatedByUserId = req.user.id;
    return await this.productsService.update(id, updateProductDto);
  }

  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('Product'))
  async findOne(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);
    return new ProductDetailEntity(product);
  }

  @Delete('media/:id')
  async removeProductMedia(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.removeProductMedia(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }

  @Delete()
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
