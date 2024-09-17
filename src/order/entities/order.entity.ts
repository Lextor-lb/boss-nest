import { Exclude, Expose } from 'class-transformer';
import { Order, OrderRecord, OrderStatus, Prisma } from '@prisma/client';
import { formatDate } from 'src/shared/utils/formatDate';

export class OrderEntity implements Order {
  id: number;
  couponName: string | null;
  cancelReason: string | null;
  remark: string | null;
  orderCode: string;
  orderStatus: OrderStatus;
  @Exclude()
  ecommerceUserId: number;
  @Exclude()
  discount: number;
  @Exclude()
  subTotal: number;
  total: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  isArchived: Date | null;
  customerName: string;
  customerEmail: string;

  @Exclude()
  address: Prisma.JsonValue;

  @Expose()
  get date(): string {
    return formatDate(this.createdAt);
  }

  // @Expose()
  // get q(): string {
  //   return formatDate(this.createdAt);
  // }


  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  private get addressData() {
    return typeof this.address === 'string'
      ? JSON.parse(this.address)
      : this.address;
  }

  constructor(partial: Partial<OrderEntity> = {}) {
    Object.assign(this, partial);
  }
}
