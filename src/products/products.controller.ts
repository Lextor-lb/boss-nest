//
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'uploads', 'products'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 2000 * 1024 }, // 2MB
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/webp',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No images uploaded', HttpStatus.BAD_REQUEST);
    }
    const imageFiles = files.filter((file) => file.fieldname === 'images');
    if (imageFiles.length === 0) {
      throw new HttpException(
        'At least one product image is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const filesMap = files.reduce((acc, file) => {
      acc[file.fieldname] = file;
      return acc;
    }, {});

    if (
      createProductDto.productVariants &&
      createProductDto.productVariants.length > 0
    ) {
      for (let i = 0; i < createProductDto.productVariants.length; i++) {
        const variantImageFieldname = `productVariants[${i}][image]`;
        if (!filesMap[variantImageFieldname]) {
          throw new HttpException(
            `Image is required for all product variants`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    createProductDto.createdByUserId = 1;
    const product = await this.productService.create(createProductDto, files);
    return product;
  }
}
