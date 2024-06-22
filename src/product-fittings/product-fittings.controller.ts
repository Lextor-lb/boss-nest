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
import { ProductFittingsService } from './product-fittings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductFittingDto } from './dto/create-product-fitting.dto';
import { ProductFittingEntity } from './entity/product-fitting.entity';
import { UpdateProductFittingDto } from './dto/update-product-fitting.dto';
import { RemoveManyProductFittingDto } from './dto/removeMany-product-fitting.dto';
import { MessageWithProductFitting } from 'src/shared/types/productFitting';
import { SearchOption } from 'src';

@Controller('product-fittings')
@UseGuards(JwtAuthGuard)
export class ProductFittingsController {
  constructor(
    private readonly productFittingsService: ProductFittingsService,
  ) {}

  @Post()
  async create(
    @Body() createProductFittingDto: CreateProductFittingDto,
    @Req() req,
  ): Promise<MessageWithProductFitting> {
    createProductFittingDto.createdByUserId = req.user.id;
    createProductFittingDto.updatedByUserId = req.user.id;
    const createdProductFitting = await this.productFittingsService.create(
      createProductFittingDto,
    );
    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductFittingEntity(createdProductFitting),
    };
  }

  @Get('all')
  async indexAll() {
    const productFittings = await this.productFittingsService.indexAll();
    return productFittings.map(
      (productFitting) => new ProductFittingEntity(productFitting),
    );
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };
    const productFittings =
      await this.productFittingsService.findAll(searchOptions);
    return {
      data: productFittings.data.map(
        (productFitting) => new ProductFittingEntity(productFitting),
      ),
      total: productFittings.total,
      page: productFittings.page,
      limit: productFittings.limit,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const productFitting = await this.productFittingsService.findOne(id);
      if (!productFitting) {
        return { status: false, message: 'Product fitting not found' };
      }
      return new ProductFittingEntity(productFitting);
    } catch (error) {
      console.error('Error fetching product fitting:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductFittingDto: UpdateProductFittingDto,
    @Req() req,
  ) {
    const updatedByUserId = req.user.id;
    const updatedProductFitting = await this.productFittingsService.update(
      id,
      updateProductFittingDto,
      updatedByUserId,
    );
    return {
      status: true,
      message: 'Updated Successfully!',
      data: new ProductFittingEntity(updatedProductFitting),
    };
  }

  @Delete()
  async removeMany(
    @Body() removeManyProductFittingDto: RemoveManyProductFittingDto,
  ) {
    const result = await this.productFittingsService.removeMany(
      removeManyProductFittingDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
