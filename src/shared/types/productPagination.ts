import { ProductEntity } from 'src/products/entity/product.entity';
import { Pagination } from './pagination';

export interface ProductPagination extends Pagination {
  totalStock: number;
  totalSalePrice: number;
  data: ProductEntity[];
}
