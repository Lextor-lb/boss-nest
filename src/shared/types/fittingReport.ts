import { FittingReportEntity } from "src/fitting-report/entities";
import { Pagination } from "./pagination";

export interface FittingReportPagination extends Pagination {
    data: FittingReportEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    orderDirection: 'asc' | 'desc';
}