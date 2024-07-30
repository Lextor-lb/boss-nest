import { Exclude, Expose } from 'class-transformer';
import { Order, OrderRecord, OrderStatus } from '@prisma/client';
import { formatDate } from 'src/shared/utils/formatDate';

export class OrderEntity implements Order {
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

    // orderRecords: OrderRecordEntity[];

  @Expose()
  get date(): string {
    return formatDate(this.createdAt);
  }

  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  constructor(partial: Partial<OrderEntity> = {}) {
    Object.assign(this, partial);
    this.initializeEntities(partial);
  }

  private initializeEntities(partial: Partial<OrderEntity>): void {}
}
