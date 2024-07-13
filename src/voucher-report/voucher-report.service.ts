import { Injectable } from '@nestjs/common';
import { CreateVoucherReportDto } from './dto/create-voucher-report.dto';
import { UpdateVoucherReportDto } from './dto/update-voucher-report.dto';
import { PrismaService } from 'src/prisma';
import { VouchersService } from 'src/vouchers/vouchers.service';
import { SearchOption } from 'src/shared/types';
import { VoucherReportPagination } from 'src/shared/types/voucherReport';
import { VoucherEntity } from 'src/vouchers/entities/voucher.entity';
import { VoucherReportEntity } from './entities';

@Injectable()
export class VoucherReportService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly vouchersService: VouchersService
  ){}

  async generateReport(options: SearchOption): Promise<VoucherReportPagination> {
    
    // Start Timer
    const start = new Date();
    start.setHours(0,0,0,0);

    // End of Hour
    const end = new Date();
    end.setHours(23,59,59,999);

    console.log(`Generating report for date range: ${start} - ${end}`);

    // Vouchers Output based on daily unit.
    const vouchers = await this.vouchersService.indexAll({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        voucherRecords: true
      }
    })

    console.log(`Vouchers found: ${vouchers.length}`, vouchers);

    const voucherReports = vouchers.map(voucher => new VoucherReportEntity({
      id: voucher.id,
      voucherCode: voucher.voucherCode,
      qty: voucher.quantity,
      total: voucher.total,
      createdAt: voucher.createdAt
    }))

    //Pagination Details
    const page = options.page || 1;
    const limit = options.limit || 10;
    const total = vouchers.length;
    const totalPages = Math.ceil(total/limit);

 // Sort the reports based on orderDirection
 const orderDirection = options.orderDirection || 'asc';
 const sortedReports = voucherReports.sort((a, b) => {
   if (orderDirection === 'asc') {
     return a.createdAt.getTime() - b.createdAt.getTime();
   } else {
     return b.createdAt.getTime() - a.createdAt.getTime();
   }
 });

    const paginatedVouchers = sortedReports.slice((page - 1) * limit, page * limit);

    return { 
    data: paginatedVouchers,
    total,
    page,
    limit,
    totalPages,
    orderDirection
  };
    // return this.vouchersService.

    // const [allVouchers, allVoucherRecords,paginatedVouchers] = 
    //   await Promise.all([
    //      this.vouchersService.barcode()
    //   ])
  }

  create(createVoucherReportDto: CreateVoucherReportDto) {
    return 'This action adds a new voucherReport';
  }

  findAll() {
    return `This action returns all voucherReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voucherReport`;
  }

  update(id: number, updateVoucherReportDto: UpdateVoucherReportDto) {
    return `This action updates a #${id} voucherReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucherReport`;
  }
}
