import { Exclude, Expose } from 'class-transformer';
import { MediaEntity } from 'src/media';

export class EcommerceProductVariantEntity {
  id: number;
  shopCode: string;
  colorCode: string;
  barcode: string;
  media: string;
  productSizing: string;
  @Exclude()
  mediaUrl: MediaEntity;

  @Expose({ name: 'mediaUrl' })
  image(): string {
    // const BASE_URL = process.env.BASE_URL;
    return new MediaEntity({ url: this.mediaUrl.url }).image();
  }

  constructor(partial: Partial<EcommerceProductVariantEntity> = {}) {
    Object.assign(this, partial);
    // this.initializeEntities(partial);
  }
  //   private initializeEntities(
  //     partial: Partial<EcommerceProductVariantEntity>,
  //   ): void {}
}
