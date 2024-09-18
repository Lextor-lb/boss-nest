import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { SearchOption } from 'src/shared/types';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { EcommerceJwtAuthGuard } from 'src/auth/ecommerce-jwt-auth.guard';
import { RolesGuard } from 'src/auth/role-guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/role';

@Controller('wishlist')
@UseGuards(EcommerceJwtAuthGuard, RolesGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    createWishlistDto.ecommerceUserId = req.user.id;
    return this.wishlistService.create(createWishlistDto);
  }

  @Roles(UserRole.ECOMUSER)
  @Get()
  async findAll(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<any> {
    const searchOptions: SearchOption = {
      page: page || 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search: search || '',
      orderBy: orderBy || 'createdAt',
      orderDirection: orderDirection || 'desc',
    };

    const ecommerceUserId = req.user.id;
    return await this.wishlistService.findAll(searchOptions, ecommerceUserId);
  }

  @Roles(UserRole.ECOMUSER)
  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('WishList'))
  findOne(@Param('id') id: number, @Req() req) {
    const ecommerceUserId = req.user.id;

    return this.wishlistService.findOne(+id, ecommerceUserId);
  }

  @Roles(UserRole.ECOMUSER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.wishlistService.remove(id);

    return {
      status: true,
      message: 'Deleted Successfully',
      data: null,
    };
    // return this.wishlistService.remove(+id);
  }
}
