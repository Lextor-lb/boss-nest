import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { EcommerceJwtAuthGuard } from 'src/auth/ecommerce-jwt-auth.guard';

@Controller('address')
@UseGuards(EcommerceJwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto, @Req() req) {
    createAddressDto.EcommerceUserId = req.user.id;
    return this.addressService.create(createAddressDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.addressService.findAll(req.user.id);
  }

  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('Address'))
  findOne(@Param('id') id: string, @Req() req) {
    return this.addressService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req,
  ) {
    return this.addressService.update(+id, updateAddressDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.addressService.remove(+id, req.user.id);
  }
}
