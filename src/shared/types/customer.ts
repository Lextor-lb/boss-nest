import { CustomerEntity } from 'src/customers/entities';
import { ResponseMessage } from './responeMessage';
import { Pagination } from './pagination';

export interface PaginatedCustomer extends Pagination {
  data: CustomerEntity[];
}

export interface FetchedCustomer extends ResponseMessage {
  data: CustomerEntity[];
}
