import { CouponEntity } from 'src/coupon/entities';
import { Pagination } from './pagination';
import { ResponseMessage } from './responseMessage';
import { ProductSizingEntity } from 'src/product-sizings';

export interface PaginatedCoupon extends Pagination {
  data: CouponEntity[];
}

export interface FetchedCoupon extends ResponseMessage {
  data: CouponEntity[];
}

export interface MessageWithCoupon extends ResponseMessage {
  data: CouponEntity;
}
