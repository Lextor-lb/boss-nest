import { Media } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class MediaEntity implements Media {
  id: number;
  url: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  productId: number | null;
  productBrandId: number | null;
  productVariantId: number | null;

  isArchived: Date | null;

  constructor(partial: Partial<MediaEntity>) {
    Object.assign(this, partial);
  }
}
