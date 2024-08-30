import { ProductTypeEntity } from 'src/product-types';
import { Pagination } from './pagination';
import { ResponseMessage } from './responseMessage';

export interface PaginatedProductType extends Pagination {
  data: ProductTypeEntity[];
}

export interface FetchedProductType extends ResponseMessage {
  data: ProductTypeEntity[];
}

export interface MessageWithProductType extends ResponseMessage {
  data: ProductTypeEntity;
}
