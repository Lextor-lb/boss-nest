import { Exclude, Expose } from 'class-transformer';

export class EcommerceProductVariantEntity {
  id: number;
  shopCode: string;
  colorCode: string;
  barcode: string;
  media: string;
  productSizing: string;
  @Exclude()
  mediaUrl: string;

  @Expose({ name: 'mediaUrl' })
  image(): string {
    const BASE_URL = process.env.BASE_URL;
    return `${BASE_URL}${this.mediaUrl}`;
  }

  constructor(partial: Partial<EcommerceProductVariantEntity> = {}) {
    Object.assign(this, partial);
    // this.initializeEntities(partial);
  }
  //   private initializeEntities(
  //     partial: Partial<EcommerceProductVariantEntity>,
  //   ): void {}
}
