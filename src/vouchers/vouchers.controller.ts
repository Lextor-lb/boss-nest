import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VoucherEntity } from './entities/voucher.entity';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';

@Controller('vouchers')
@UseGuards(JwtAuthGuard)
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}
  @Get('barcode/:barcode')
  async barcode(@Param('barcode') barcode: string) {
    return this.vouchersService.barcode(barcode);
  }

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('Voucher'))
  async findOne(@Param('id') id: number): Promise<VoucherEntity> {
    return await this.vouchersService.findOne(id);
  }
}
