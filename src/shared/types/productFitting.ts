import { Pagination } from './pagination';
import { ResponseMessage } from './responseMessage';
import { ProductFittingEntity } from 'src';

export interface PaginatedProductFitting extends Pagination {
  data: ProductFittingEntity[];
}

export interface FetchProductFitting extends ResponseMessage {
  data: ProductFittingEntity[];
}

export interface MessageWithProductFitting extends ResponseMessage {
  data: ProductFittingEntity;
}
