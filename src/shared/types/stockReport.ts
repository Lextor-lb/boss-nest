import { Pagination } from './pagination';
import { StockReportEntity } from 'src/stock-report/entities/stock-report.entity';

export interface StockReportPagination extends Pagination {
  products: StockReportEntity[];
}
