import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EcommerceProductsService } from './ecommerce-products.service';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { EcommerceJwtAuthGuard } from 'src/auth/ecommerce-jwt-auth.guard';

@Controller('ecommerce-products')
export class EcommerceProductsController {
  constructor(
    private readonly ecommerceProductsService: EcommerceProductsService,
  ) {}

  @Get('riddle/:type?')
  findAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortGender') sortGender?: string,
    @Query('sortBrand') sortBrand?: string,
    @Query('sortType') sortType?: string,
    @Query('min') min?: number,
    @Query('max') max?: number,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
    @Param('type') type?: string,
  ) {
    const sortGenderArray = sortGender ? sortGender.split(',') : [];
    const sortBrandArray = sortBrand ? sortBrand.split(',') : [];
    const sortTypeArray = sortType ? sortType.split(',') : [];

    const searchOptions = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
      sortGender: sortGenderArray,
      sortBrand: sortBrandArray,
      sortType: sortTypeArray,
      min: min ? parseInt(min.toString(), 10) : null,
      max: max ? parseInt(max.toString(), 10) : null,
    };
    return this.ecommerceProductsService.findAllProducts(searchOptions, type);
  }

  // @UseGuards(EcommerceJwtAuthGuard)
  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('Product'))
  findOne(@Param('id') id: number) {
    return this.ecommerceProductsService.findOne(id);
  }
}
