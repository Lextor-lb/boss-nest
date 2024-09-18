import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EcommerceUsersService } from './ecommerce-users.service';
import { UpdateEcommerceUserDto } from './dto/update-ecommerce-user.dto';
import { EcommerceJwtAuthGuard } from 'src/auth/ecommerce-jwt-auth.guard';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { RolesGuard } from 'src/auth/role-guard';
import { Roles } from 'src/auth/role';
import { UserRole } from '@prisma/client';

@Controller('ecommerce-users')
@UseGuards(EcommerceJwtAuthGuard, RolesGuard)
export class EcommerceUsersController {
  constructor(private readonly ecommerceUsersService: EcommerceUsersService) {}

  @Get(':id')
  @Roles(UserRole.ECOMUSER)
  @UsePipes(new ValidateIdExistsPipe('EcommerceUser'))
  findOne(@Param('id') id: string) {
    return this.ecommerceUsersService.findOne(+id);
  }

  @Roles(UserRole.ECOMUSER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEcommerceUserDto: UpdateEcommerceUserDto,
  ) {
    return this.ecommerceUsersService.update(+id, updateEcommerceUserDto);
  }
}
