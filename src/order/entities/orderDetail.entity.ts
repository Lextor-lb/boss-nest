import { Exclude, Expose } from 'class-transformer';
import { Order, OrderRecord, OrderStatus } from '@prisma/client';
import { formatDate, formatTime } from 'src/shared/utils/formatDate';

export class OrderDetailEntity implements Order {
  id: number;
  orderId: string;
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

  orderRecords: {
    id: number;
    productName: string;
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
    this.initializeEntities(partial);
  }

  private initializeEntities(partial: Partial<OrderDetailEntity>): void {}
}
