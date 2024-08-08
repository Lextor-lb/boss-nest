import { Exclude, Expose, Transform } from 'class-transformer';
import { MediaEntity } from 'src/media';
import { ProductEntity } from 'src/products';
import { createEntity } from 'src/shared/utils/createEntity';
import { UserEntity } from 'src/users/entities/user.entity';

export class SliderEntity {
  id: number;

  @Expose()
  @Transform(({ value }) => (value ? new MediaEntity(value).image() : null))
  place1Desktop: MediaEntity;

  @Expose()
  @Transform(({ value }) => (value ? new MediaEntity(value).image() : null))
  place1Mobile: MediaEntity;

  @Expose()
  @Transform(({ value }) => (value ? new MediaEntity(value).image() : null))
  place2Desktop: MediaEntity;

  @Expose()
  @Transform(({ value }) => (value ? new MediaEntity(value).image() : null))
  place2Mobile: MediaEntity;

  @Expose()
  @Transform(({ value }) => (value ? new MediaEntity(value).image() : null))
  place3Desktop: MediaEntity;

  @Expose()
  @Transform(({ value }) => (value ? new MediaEntity(value).image() : null))
  place3Mobile: MediaEntity;

  @Expose()
  @Transform(({ value }) => (value ? new MediaEntity(value).image() : null))
  place4Desktop: MediaEntity;

  @Expose()
  @Transform(({ value }) => (value ? new MediaEntity(value).image() : null))
  place4Mobile: MediaEntity;

  photosForMobile: { img1: string; img2: string; img3: string; img4: string };
  photosForDesktop: { img1: string; img2: string; img3: string; img4: string };

  @Exclude()
  createAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdByUserId: number;
  @Exclude()
  updatedByUserId: number;

  createdByUser?: UserEntity;
  updatedByUser?: UserEntity;

  constructor(slider: any,data: Partial<SliderEntity> = {}) {
    Object.assign(this, data);

    this.photosForMobile = {
      img1: slider.place1Mobile ? new MediaEntity(slider.place1Mobile).image() : null,
      img2: slider.place2Mobile ? new MediaEntity(slider.place2Mobile).image() : null,
      img3: slider.place3Mobile ? new MediaEntity(slider.place3Mobile).image() : null,
      img4: slider.place4Mobile ? new MediaEntity(slider.place4Mobile).image() : null,
    };

    this.photosForDesktop = {
      img1: slider.place1Desktop ? new MediaEntity(slider.place1Desktop).image() : null,
      img2: slider.place2Desktop ? new MediaEntity(slider.place2Desktop).image() : null,
      img3: slider.place3Desktop ? new MediaEntity(slider.place3Desktop).image() : null,
      img4: slider.place4Desktop ? new MediaEntity(slider.place4Desktop).image() : null,
    };

    const mediaKeys = [
      'place1Desktop',
      'place1Mobile',
      'place2Desktop',
      'place2Mobile',
      'place3Desktop',
      'place3Mobile',
      'place4Desktop',
      'place4Mobile',
    ];

    mediaKeys.forEach(key => {
      if (slider[key]) {
        this[key] = new MediaEntity(slider[key]);
      }
    });
  }
}
