import { Pagination } from "./pagination";
import { SizingReportEntity } from "src/sizing-report/entities/sizing-report.entity";

export interface SizingReportPagination extends Pagination {
    data: SizingReportEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    orderDirection: 'asc' | 'desc';
}