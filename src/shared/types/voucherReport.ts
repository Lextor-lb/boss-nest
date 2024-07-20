import { VoucherReportEntity } from "src/voucher-report/entities";
import { Pagination } from "./pagination";

export interface VoucherReportPagination extends Pagination {
    chartData?: {
        period: string;
        totalAmount: number;
        voucherCount: number;
    }[];
    data: VoucherReportEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    orderDirection: 'asc' | 'desc';
}