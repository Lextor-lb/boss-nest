import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VoucherEntity } from './entities/voucher.entity';

@Controller('vouchers')
@UseGuards(JwtAuthGuard)
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}
  @Get('barcode/:barcode')
  async barcode(@Param('barcode') barcode: string) {
    return this.vouchersService.barcode(barcode);
  }

  @Get('all')
  async indexAll() {
     const vouchers = await this.vouchersService.indexAll();
     return {
      status: true,
      message: 'Fetched Successfully',
      data: vouchers.map((voucher) => new VoucherEntity(voucher))
     }
  }

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VoucherEntity> {
    return await this.vouchersService.findOne(id);
  }
}
