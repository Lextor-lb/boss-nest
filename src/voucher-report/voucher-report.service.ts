import { Injectable } from '@nestjs/common';
import { CreateVoucherReportDto } from './dto/create-voucher-report.dto';
import { UpdateVoucherReportDto } from './dto/update-voucher-report.dto';
import { PrismaService } from 'src/prisma';
import { VouchersService } from 'src/vouchers/vouchers.service';
import { SearchOption } from 'src/shared/types';
import { VoucherReportPagination } from 'src/shared/types/voucherReport';
import { VoucherEntity } from 'src/vouchers/entities/voucher.entity';
import { VoucherReportEntity } from './entities';
import { differenceInDays, format, parse } from 'date-fns';

@Injectable()
export class VoucherReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vouchersService: VouchersService,
  ) {}

  async generateReport(
    options: SearchOption,
  ): Promise<VoucherReportPagination> {
    // Start Timer
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    // End of Hour
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    console.log(`Generating report for date range: ${start} - ${end}`);

    // Vouchers Output based on daily unit.
    const vouchers = await this.vouchersService.indexAll({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        voucherRecords: true,
      },
    });

    // console.log(`Vouchers found: ${vouchers.length}`, vouchers);

    const voucherReports = vouchers.map(
      (voucher) =>
        new VoucherReportEntity({
          id: voucher.id,
          voucherCode: voucher.voucherCode,
          qty: voucher.quantity,
          total: voucher.total,
          payment: voucher.paymentMethod,
          createdAt: voucher.createdAt,
        }),
    );

    //Pagination Details
    const page = options.page || 1;
    const limit = options.limit || 10;
    const total = vouchers.length;
    const totalPages = Math.ceil(total / limit);

    // Sort the reports based on orderDirection
    const orderDirection = options.orderDirection || 'asc';
    const sortedReports = voucherReports.sort((a, b) => {
      if (orderDirection === 'asc') {
        return a.createdAt.getTime() - b.createdAt.getTime();
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    const paginatedVouchers = sortedReports.slice(
      (page - 1) * limit,
      page * limit,
    );

    return {
      data: paginatedVouchers,
      total,
      page,
      limit,
      totalPages,
      orderDirection,
    };
    // return this.vouchersService.

    // const [allVouchers, allVoucherRecords,paginatedVouchers] =
    //   await Promise.all([
    //      this.vouchersService.barcode()
    //   ])
  }

  async customReport(
    start: string,
    end: string,
    options: SearchOption,
  ): Promise<VoucherReportPagination> {
    const startDate = parse(start, 'dd-MM-yyyy', new Date());
    const endDate = parse(end, 'dd-MM-yyyy', new Date());

    const daysDiff = differenceInDays(endDate, startDate);
    let formatFunc: (date: Date) => string;

    if (daysDiff <= 30) {
      formatFunc = (date: Date) => format(date, 'dd/MM/yyyy');
    } else if (daysDiff < +60) {
      formatFunc = (date: Date) =>
        `Week ${Math.ceil(date.getDate() / 7)}/${date.getFullYear()}`;
    } else {
      formatFunc = (date: Date) => format(date, 'MM/yyyy');
    }

    // Format the dates to ISO-8601
    const isoStartDate = startDate.toISOString();
    const isoEndDate = endDate.toISOString();

    // Vouchers Output based on daily unit.
    const vouchers = await this.prisma.voucher.findMany({
      where: {
        createdAt: {
          gte: isoStartDate,
          lt: isoEndDate,
        },
      },
      include: {
        voucherRecords: true,
      },
    });

    console.log(`Vouchers found: ${vouchers.length}`, vouchers);

    const chartDataMap = new Map<
      string,
      { totalAmount: number; voucherCount: number }
    >();

    vouchers.forEach((voucher) => {
      const period = formatFunc(new Date(voucher.createdAt));
      const totalAmount = voucher.total;
      const voucherCount = voucher.voucherRecords.length;

      if (!chartDataMap.has(period)) {
        chartDataMap.set(period, { totalAmount: 0, voucherCount: 0 });
      }

      const data = chartDataMap.get(period);
      data.totalAmount += totalAmount;
      data.voucherCount += voucherCount;
    });

    // Prepare chart data
    const chartData = Array.from(chartDataMap, ([period, data]) => ({
      period,
      totalAmount: data.totalAmount,
      voucherCount: data.voucherCount,
    }));

    // Pagination Details
    const page = options.page || 1;
    const limit = options.limit || 10;
    const total = vouchers.length;
    const totalPages = Math.ceil(total / limit);

    // Sort the reports based on orderDirection
    const orderDirection = options.orderDirection || 'asc';
    const sortedReports = vouchers.sort((a, b) => {
      if (orderDirection === 'asc') {
        return a.createdAt.getTime() - b.createdAt.getTime();
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    // Paginate the sorted results
    const paginatedVouchers = sortedReports
      .slice((page - 1) * limit, page * limit)
      .map((voucher) => ({
        id: voucher.id,
        voucherCode: voucher.voucherCode,
        tax: voucher.tax,
        qty: voucher.quantity,
        payment: voucher.paymentMethod,
        total: voucher.total,
        createdAt: voucher.createdAt,
        date: new Date(voucher.createdAt).toLocaleTimeString(),
        time: new Date(voucher.createdAt).toLocaleDateString(),
      }));

    return {
      chartData,
      data: paginatedVouchers,
      total,
      page,
      limit,
      totalPages,
      orderDirection,
    };
  }
}
