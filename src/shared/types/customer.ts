import { CustomerEntity } from 'src/customers/entities';
import { Pagination } from './pagination';
import { ResponseMessage } from './responseMessage';

export interface CustomerPagination extends Pagination {
  data: CustomerEntity[];
}

export interface FetchedCustomer extends ResponseMessage {
  data: CustomerEntity[];
}

export interface MessageWithCustomer extends ResponseMessage {
  data: CustomerEntity;
}

export interface FetchedCustomerWithAnalysis extends FetchedCustomer {
  analysis: {
    totalCustomers: number;
    agePercents: {
      YOUNG: number;
      MIDDLE: number;
      OLD: number;
    };
    genderPercents: {
      MALE: number;
      FEMALE: number;
    };
  };
}