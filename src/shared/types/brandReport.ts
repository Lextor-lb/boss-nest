import { Pagination } from "./pagination";
import { BrandReportEntity } from "src/brand-report/entities/brand-report.entity";

export interface BrandReportPagination extends Pagination {
    data: BrandReportEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    orderDirection: 'asc' | 'desc';
}