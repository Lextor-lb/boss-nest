// import { Exclude, Expose } from 'class-transformer';
// import { OrderRecord, ProductVariant } from '@prisma/client';
// import { OrderEntity } from './order.entity';
// export class OrderRecordEntity implements OrderRecord {
//   id: number;
//   productVariantId: number;
//   salePrice: number;
//   createdAt: Date;
//   updatedAt: Date;
//   orderId: number;
//   isArchived: Date | null;

//   order: OrderEntity;
// //   productVariant: ProductVariantEntity;

//   @Exclude()
//   createdByUserId: number;

//   @Exclude()
//   updatedByUserId: number;

//   constructor(partial: Partial<OrderRecordEntity> = {}) {
//     Object.assign(this, partial);
//     this.initializeEntities(partial);
//   }

//   private initializeEntities(partial: Partial<OrderRecordEntity>): void {}
// }
