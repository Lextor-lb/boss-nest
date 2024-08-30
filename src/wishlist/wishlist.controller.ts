import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards, UsePipes, ParseIntPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { SearchOption } from 'src/shared/types';
import { JwtAuthGuard } from 'src/auth';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    // createWishlistDto.ecommerceUserId = req.user.id;
    return this.wishlistService.create(createWishlistDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc'
  ): Promise<any> {
    const searchOptions: SearchOption = {
      page: page || 1,
      limit: limit ? parseInt(limit, 10): 10,
      search: search || '',
      orderBy: orderBy || 'createdAt',
      orderDirection: orderDirection || 'desc'
    };

    // const ecommerceUserId = req.user.id;
    return await this.wishlistService.findAll(searchOptions);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('WishList'))
  findOne(@Param('id') id: number, @Req() req) {
    // const ecommerceUserId = req.user.id

    return this.wishlistService.findOne(+id);
    // return this.wishlistService.findOne(+id,ecommerceUserId);
  }

   @Delete(':id')
   async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.wishlistService.remove(id);

    return {
      status: true,
      message: 'Deleted Successfully',
      data: null
    }
    // return this.wishlistService.remove(+id);
  }
}
