import {
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
  ) {
    const createdByUserId = req.user.id;

    // Assign createdByUserId to each DTO
    createProductSizingDtos.forEach((dto) => {
      dto.createdByUserId = createdByUserId;
    });
    const createdProductSizings =
      await this.productSizingsService.createMultiple(createProductSizingDtos);
    return {
      status: true,
      message: 'Created Successfully!',
      data: createdProductSizings.map(
        (productSizing) => new ProductSizingEntity(productSizing),
      ),
    };
  }

  @Get('all')
  async indexAll() {
    const productSizings = await this.productSizingsService.indexAll();
    return productSizings.map(
      (productSizing) => new ProductSizingEntity(productSizing),
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
    const productSizings = await this.productSizingsService.findAll(
      page,
      limit,
      searchName,
      orderBy,
      orderDirection,
    );
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const productSizing = await this.productSizingsService.findOne(id);
      if (!productSizing) {
        return { message: 'Product Sizing not found' };
      }
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
  ) {
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedProductSizing = await this.productSizingsService.remove(id);
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: new ProductSizingEntity(deletedProductSizing),
    };
  }

  @Delete()
  async removeMany(@Body() ids: number[]) {
    return this.productSizingsService.removeMany(ids);
  }
}
