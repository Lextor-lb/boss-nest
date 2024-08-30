import { CategoryReportEntity } from "src/category-report/entities/category-report.entity";
import { Pagination } from "./pagination";

export interface CategoryReportPagination extends Pagination {
    data: CategoryReportEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    orderDirection: 'asc' | 'desc';
}