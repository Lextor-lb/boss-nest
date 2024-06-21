import { ProductEntity } from 'src/products/entity/product.entity';
import { Pagination } from './pagination';
import { ResponseMessage } from './responeMessage';

export interface ProductPagination extends Pagination {
  totalStock: number;
  totalSalePrice: number;
  data: ProductEntity[];
}

export interface FetchProduct extends ResponseMessage {
  data: ProductEntity[];
}
