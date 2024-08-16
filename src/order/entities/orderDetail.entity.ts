import { Exclude, Expose } from 'class-transformer';
import { Order, OrderStatus } from '@prisma/client';
import { formatDate, formatTime } from 'src/shared/utils/formatDate';
import { MediaEntity } from 'src/media';

export class OrderDetailEntity implements Order {
  id: number;
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

  orderRecords: {
    id: number;
    productName: string;
    image: MediaEntity;
    productCode: string;
    gender: string;
    colorCode: string;
    typeName: string;
    categoryName: string;
    fittingName: string;
    sizingName: string;
    price: number;
  }[];

  @Expose()
  get date(): string {
    return formatDate(this.createdAt);
  }
  @Expose()
  get time(): string {
    return formatTime(this.createdAt);
  }

  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  constructor(partial: Partial<OrderDetailEntity> = {}) {
    Object.assign(this, partial);
  }
}
