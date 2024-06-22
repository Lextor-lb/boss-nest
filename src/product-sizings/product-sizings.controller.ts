import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductSizingsService } from './product-sizings.service';
import { CreateProductSizingDto } from './dto/create-product-sizing.dto';
import { ProductSizingEntity } from './entity/product-sizing.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProductSizingDto } from './dto/update-product-sizing.dto';
import { RemoveManyProductSizingDto } from './dto/removeMany-product-sizing.dto';
import { FetchedProductSizing, MessageWithProductSizing, PaginatedProductSizing } from 'src/shared/types/productSizing';
import { SearchOption } from 'src';

@Controller('product-sizings')
@UseGuards(JwtAuthGuard)
export class ProductSizingsController {
  constructor(private readonly productSizingsService: ProductSizingsService) {}

  //   @Post()
  //   async create(
  //     @Body() createProductSizingDto: CreateProductSizingDto,
  //     @Req() req,
  //   ) {
  //     createProductSizingDto.createdByUserId = req.user.id;
  //     const createdProductSizing = await this.productSizingsService.create(
  //       createProductSizingDto,
  //     );
  //     return {
  //       status: true,
  //       message: 'Created Successfully!',
  //       data: new ProductSizingEntity(createdProductSizing),
  //     };
  //   }

  @Post()
  async createMultiple(
    @Body() createProductSizingDtos: CreateProductSizingDto[],
    @Req() req,
  ): Promise<FetchedProductSizing> {
    try {
      createProductSizingDtos.forEach((dto) => {
        dto.createdByUserId = req.user.id;
        dto.updatedByUserId = req.user.id;
      });
      const createdProductSizings =
        await this.productSizingsService.createMultiple(
          createProductSizingDtos,
        );
      return {
        status: true,
        message: 'Created Successfully!',
        data: createdProductSizings.map(
          (productSizing) => new ProductSizingEntity(productSizing),
        ),
      };
    } catch (error) {
      throw new BadRequestException('error creating sizings');
    }
  }

  @Get('all')
  async indexAll(): Promise<FetchedProductSizing> {
    const productSizings = await this.productSizingsService.indexAll();
    return {
      status: true,
      message: 'Fetched Successfully!',
      data: productSizings.map(
        (productSizing) => new ProductSizingEntity(productSizing),
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
  ): Promise<PaginatedProductSizing> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };
    const productSizings =
      await this.productSizingsService.findAll(searchOptions);
    return {
      data: productSizings.data.map(
        (productSizing) => new ProductSizingEntity(productSizing),
      ),
      total: productSizings.total,
      page: productSizings.page,
      limit: productSizings.limit,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductSizingEntity> {
    try {
      const productSizing = await this.productSizingsService.findOne(id);
      return new ProductSizingEntity(productSizing);
    } catch (error) {
      console.error('Error fetching product sizing:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateProductSizingDto: UpdateProductSizingDto,
  ): Promise<MessageWithProductSizing> {
    updateProductSizingDto.updatedByUserId = req.user.id;
    const updatedProductSizing = await this.productSizingsService.update(
      id,
      updateProductSizingDto,
    );
    return {
      status: true,
      message: 'Updated Successfully!',
      data: new ProductSizingEntity(updatedProductSizing),
    };
  }

  @Delete()
  async removeMany(
    @Body() removeManyProductSizingDto: RemoveManyProductSizingDto,
  ) {
    const result = await this.productSizingsService.removeMany(
      removeManyProductSizingDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
//    @UploadedFile() file: Express.Multer.File,
