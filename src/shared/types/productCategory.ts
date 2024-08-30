import { Pagination } from './pagination';
import { ResponseMessage } from './responseMessage';
import { ProductCategoryEntity } from 'src';

export interface PaginatedProductCategory extends Pagination {
  data: ProductCategoryEntity[];
}

export interface FetchProductCategory extends ResponseMessage {
  data: ProductCategoryEntity[];
}

export interface MessageWithProductCategory extends ResponseMessage {
  data: ProductCategoryEntity;
}
