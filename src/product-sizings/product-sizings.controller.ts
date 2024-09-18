import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProductSizingsService } from './product-sizings.service';
import { CreateProductSizingDto } from './dto/create-product-sizing.dto';
import { ProductSizingEntity } from './entity/product-sizing.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProductSizingDto } from './dto/update-product-sizing.dto';
import { RemoveManyProductSizingDto } from './dto/removeMany-product-sizing.dto';
import {
  FetchedProductSizing,
  MessageWithProductSizing,
  PaginatedProductSizing,
} from 'src/shared/types/productSizing';
import { SearchOption } from 'src';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { RolesGuard } from 'src/auth/role-guard';
import { Roles } from 'src/auth/role';
import { UserRole } from '@prisma/client';

@Controller('product-sizings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductSizingsController {
  constructor(private readonly productSizingsService: ProductSizingsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
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
      totalPages: productSizings.totalPages,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidateIdExistsPipe('ProductSizing'))
  async findOne(@Param('id') id: number): Promise<ProductSizingEntity> {
    const productSizing = await this.productSizingsService.findOne(id);
    return new ProductSizingEntity(productSizing);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
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

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productSizingsService.remove(id);
  }

  @Delete()
  @Roles(UserRole.ADMIN)
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
