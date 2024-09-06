import { Exclude, Expose } from 'class-transformer';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import { formatDate, formatTime } from 'src/shared/utils/formatDate';
import { MediaEntity } from 'src/media';
import { EcommerceUserEntity } from 'src/ecommerce-users/entities/ecommerce-user.entity';

export class OrderDetailEntity implements Order {
  id: number;
  couponName: string | null;
  orderCode: string;
  orderStatus: OrderStatus;
  cancelReason: string | null;
  remark: string | null;
  @Exclude()
  ecommerceUserId: number;
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
  @Exclude()
  address: Prisma.JsonValue;
  ecommerceUser: EcommerceUserEntity;

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

  @Expose()
  get customerAddress(): string {
    return this.addressData;
  }

  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  private get addressData() {
    return typeof this.address === 'string'
      ? JSON.parse(this.address)
      : this.address;
  }

  constructor(partial: Partial<OrderDetailEntity> = {}) {
    Object.assign(this, partial);
  }
}
