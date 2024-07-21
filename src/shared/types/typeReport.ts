import { TypeReportEntity } from "src/type-report/entities";
import { Pagination } from "./pagination";

export interface TypeReportPagination extends Pagination {
    data: TypeReportEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    orderDirection: 'asc' | 'desc';
}