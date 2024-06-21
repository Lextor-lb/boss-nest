import { Pagination } from './pagination';
import { ResponseMessage } from './responeMessage';
import { ProductSizingEntity } from 'src/product-sizings';

export interface PaginatedSizing extends Pagination {
  data: ProductSizingEntity[];
}

export interface FetchedSizing extends ResponseMessage {
  data: ProductSizingEntity[];
}

export interface MessageWithSizing extends ResponseMessage {
  data: ProductSizingEntity;
}
