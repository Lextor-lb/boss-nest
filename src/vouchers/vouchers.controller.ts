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
      data: vouchers.map((voucher) => new VoucherEntity(voucher)),
    };
  }

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto, @Req() req) {
    createVoucherDto.createdByUserId = req.user.id;
    return this.vouchersService.create(createVoucherDto);
  }

  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('Voucher'))
  async findOne(@Param('id') id: number): Promise<VoucherEntity> {
    return await this.vouchersService.findOne(id);
  }
}
