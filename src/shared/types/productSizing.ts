import { Pagination } from './pagination';
import { ResponseMessage } from './responseMessage';
import { ProductSizingEntity } from 'src/product-sizings';

export interface PaginatedProductSizing extends Pagination {
  data: ProductSizingEntity[];
}

export interface FetchedProductSizing extends ResponseMessage {
  data: ProductSizingEntity[];
}

export interface MessageWithProductSizing extends ResponseMessage {
  data: ProductSizingEntity;
}
