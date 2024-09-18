import { Optional } from '@nestjs/common';
import { Media } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

// `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/` +
//     resizedDesktopImagePath;

export class MediaEntity implements Media {
  id: number;
  @Optional()
  @Exclude()
  url: string;

  @Expose({ name: 'url' })
  image(): string {
    // const BASE_URL = process.env.BASE_URL;

    return (
      `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/` +
      this.url
    );
    // return `${BASE_URL}${this.url}`;
  }

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
  @Transform(({ value }) => (value !== null ? value : undefined))
  productId: number | null;
  // productBrandId: number | null;
  // productVariantId: number | null;
  @Exclude()
  isArchived: Date | null;

  @IsOptional()
  imageType: 'desktop' | 'mobile';

  constructor(data: Partial<MediaEntity>) {
    Object.assign(this, data);
  }
}
