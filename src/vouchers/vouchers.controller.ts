import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  UsePipes,
  Req,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VoucherEntity } from './entities/voucher.entity';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { RolesGuard } from 'src/auth/role-guard';
import { Roles } from 'src/auth/role';
import { UserRole } from '@prisma/client';

@Controller('vouchers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get('barcode/:barcode')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async barcode(@Param('barcode') barcode: string) {
    return this.vouchersService.barcode(barcode);
  }

  @Get('all')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async indexAll() {
    const vouchers = await this.vouchersService.indexAll();
    return {
      status: true,
      message: 'Fetched Successfully',
      data: vouchers.map((voucher) => new VoucherEntity(voucher)),
    };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  create(@Body() createVoucherDto: CreateVoucherDto, @Req() req) {
    createVoucherDto.createdByUserId = req.user.id;
    return this.vouchersService.create(createVoucherDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UsePipes(new ValidateIdExistsPipe('Voucher'))
  async findOne(@Param('id') id: number): Promise<VoucherEntity> {
    return await this.vouchersService.findOne(id);
  }
}
