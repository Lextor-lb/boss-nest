// import {
//   Controller,
//   Post,
//   Body,
//   UploadedFile,
//   UseInterceptors,
//   Req,
//   HttpException,
//   HttpStatus,
//   UseGuards,
//   Get,
//   Query,
//   ParseIntPipe,
//   Param,
//   Put,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname, join } from 'path';
// import { ProductBrandsService } from './product-brands.service';
// import { CreateProductBrandDto } from './dto/create-product-brand.dto';
// import { ProductBrandEntity } from './entity/product-brand.entity';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { ConfigService } from '@nestjs/config';
// import { UpdateProductBrandDto } from './dto/update-product-brand.dto';

// @Controller('product-brands')
// @UseGuards(JwtAuthGuard)
// export class ProductBrandsController {
//   constructor(
//     private readonly productBrandsService: ProductBrandsService,
//     private readonly configService: ConfigService,
//   ) {}

//   @Post()
//   @UseInterceptors(
//     FileInterceptor('image', {
//       storage: diskStorage({
//         destination: join(__dirname, '..', '..', 'uploads', 'brands'),
//         filename: (req, file, callback) => {
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const ext = extname(file.originalname);
//           const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
//           callback(null, filename);
//         },
//       }),
//       limits: { fileSize: 2000 * 1024 }, // 2MB
//       fileFilter: (req, file, callback) => {
//         const allowedTypes = [
//           'image/png',
//           'image/jpg',
//           'image/jpeg',
//           'image/webp',
//         ];
//         if (allowedTypes.includes(file.mimetype)) {
//           callback(null, true);
//         } else {
//           callback(
//             new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
//             false,
//           );
//         }
//       },
//     }),
//   )
//   async create(
//     @Body() createProductBrandDto: CreateProductBrandDto,
//     @UploadedFile() file: Express.Multer.File,
//     @Req() req,
//   ) {
//     if (!file) {
//       throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
//     }

//     const createdByUserId = req.user.id;
//     const createdProductBrand = await this.productBrandsService.create(
//       createProductBrandDto,
//       file.filename,
//       createdByUserId,
//     );

//     return {
//       status: true,
//       message: 'Created Successfully!',
//       data: new ProductBrandEntity(createdProductBrand),
//     };
//   }

//   @Get('all')
//   async indexAll() {
//     const productBrands = await this.productBrandsService.indexAll();
//     return productBrands.map(
//       (productBrand) => new ProductBrandEntity(productBrand),
//     );
//   }
//   @Get()
//   async findAll(
//     @Query('page') page: number = 1,
//     @Query('limit', ParseIntPipe) limit: number = 10,
//     @Query('searchName') searchName?: string,
//     @Query('orderBy') orderBy: string = 'createdAt',
//     @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
//   ) {
//     const productBrands = await this.productBrandsService.findAll(
//       page,
//       limit,
//       searchName,
//       orderBy,
//       orderDirection,
//     );

//     const baseUrl = this.configService.get<string>('app.baseUrl');

//     const data = productBrands.data.map((productBrand) => {
//       const entity = new ProductBrandEntity(productBrand);
//       if (entity.image) {
//         entity.image = `${baseUrl}${entity.image}`;
//       }
//       return entity;
//     });

//     return {
//       data,
//       total: productBrands.total,
//       page: productBrands.page,
//       limit: productBrands.limit,
//     };
//   }

//   @Get(':id')
//   async findOne(@Param('id', ParseIntPipe) id: number) {
//     try {
//       const productBrand = await this.productBrandsService.findOne(id);
//       if (!productBrand) {
//         return { status: false, message: 'Product Sizing not found' };
//       }
//       return new ProductBrandEntity(productBrand);
//     } catch (error) {
//       console.error('Error fetching product brand:', error);
//       throw new HttpException(
//         'Internal Server Error',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
//   @Put(':id')
//   @UseInterceptors(
//     FileInterceptor('image', {
//       storage: diskStorage({
//         destination: join(__dirname, '..', '..', 'uploads', 'brands'),
//         filename: (req, file, callback) => {
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const ext = extname(file.originalname);
//           const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
//           callback(null, filename);
//         },
//       }),
//       limits: { fileSize: 2000 * 1024 }, // 2MB
//       fileFilter: (req, file, callback) => {
//         const allowedTypes = [
//           'image/png',
//           'image/jpg',
//           'image/jpeg',
//           'image/webp',
//         ];
//         if (allowedTypes.includes(file.mimetype)) {
//           callback(null, true);
//         } else {
//           callback(
//             new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
//             false,
//           );
//         }
//       },
//     }),
//   )
//   async update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateProductBrandDto: UpdateProductBrandDto,
//     @UploadedFile() file: Express.Multer.File,
//     @Req() req,
//   ) {
//     const updatedByUserId = req.user.id;
//     const updatedProductBrand = await this.productBrandsService.update(
//       id,
//       updateProductBrandDto,
//       file ? file.filename : null,
//       updatedByUserId,
//     );

//     if (!updatedProductBrand) {
//       throw new HttpException('Product Brand not found', HttpStatus.NOT_FOUND);
//     }

//     return {
//       status: true,
//       message: 'Updated Successfully!',
//       data: new ProductBrandEntity(updatedProductBrand),
//     };
//   }
// }

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
  Query,
  ParseIntPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProductBrandsService } from './product-brands.service';
import { CreateProductBrandDto } from './dto/create-product-brand.dto';
import { ProductBrandEntity } from './entity/product-brand.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { UpdateProductBrandDto } from './dto/update-product-brand.dto';
import { RemoveManyProductBrandDto } from './dto/removeMany-product-brand.dto';

@Controller('product-brands')
@UseGuards(JwtAuthGuard)
export class ProductBrandsController {
  constructor(
    private readonly productBrandsService: ProductBrandsService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'uploads', 'brands'),
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
    @Body() createProductBrandDto: CreateProductBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }

    const createdByUserId = req.user.id;
    const createdProductBrand = await this.productBrandsService.create(
      createProductBrandDto,
      file.filename,
      createdByUserId,
    );

    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductBrandEntity(createdProductBrand),
    };
  }

  @Get('all')
  async indexAll() {
    const productBrands = await this.productBrandsService.indexAll();
    return productBrands.map(
      (productBrand) => new ProductBrandEntity(productBrand),
    );
  }
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('searchName') searchName?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const productBrands = await this.productBrandsService.findAll(
      page,
      limit,
      searchName,
      orderBy,
      orderDirection,
    );

    const baseUrl = this.configService.get<string>('app.baseUrl');

    const data = productBrands.data.map((productBrand) => {
      const entity = new ProductBrandEntity(productBrand);
      if (entity.image) {
        entity.image = `${baseUrl}${entity.image}`;
      }
      return entity;
    });

    return {
      data,
      total: productBrands.total,
      page: productBrands.page,
      limit: productBrands.limit,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const productBrand = await this.productBrandsService.findOne(id);
      if (!productBrand) {
        return { status: false, message: 'Product Sizing not found' };
      }
      return new ProductBrandEntity(productBrand);
    } catch (error) {
      console.error('Error fetching product brand:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'uploads', 'brands'),
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductBrandDto: UpdateProductBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const updatedByUserId = req.user.id;
    const updatedProductBrand = await this.productBrandsService.update(
      id,
      updateProductBrandDto,
      file ? file.filename : null,
      updatedByUserId,
    );

    if (!updatedProductBrand) {
      throw new HttpException('Product Brand not found', HttpStatus.NOT_FOUND);
    }

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
