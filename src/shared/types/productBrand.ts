import { ProductBrandEntity } from 'src/product-brands';
import { Pagination } from './pagination';
import { ResponseMessage } from './responseMessage';

export interface PaginatedProductBrand extends Pagination {
  data: ProductBrandEntity[];
}

export interface FetchedProductBrand extends ResponseMessage {
  data: ProductBrandEntity[];
}

export interface MessageWithProductBrand extends ResponseMessage {
  data: ProductBrandEntity;
}
