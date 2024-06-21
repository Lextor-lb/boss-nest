import { Media } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

export class MediaEntity implements Media {
  id: number;
  url: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
  @Transform(({ value }) => (value !== null ? value : undefined))
  productId: number | null;
  productBrandId: number | null;
  productVariantId: number | null;
  @Exclude()
  isArchived: Date | null;

  constructor(partial: Partial<MediaEntity>) {
    Object.assign(this, partial);
  }
}
