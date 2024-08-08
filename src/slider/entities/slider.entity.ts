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


    const mediaKeys = [
      {
        desktopImage:  'place1Desktop',
        mobileImage : 'place1Mobile',
        sort : 1,
      },
      {
        desktopImage:'place2Desktop',
        mobileImage: 'place2Mobile',
        sort:2
      },
      {
        desktopImage : 'place3Desktop',
        mobileImage: 'place3Mobile',
        sort: 3,
      },
      {
        desktopImage: 'place4Desktop',
        mobileImage: 'place4Mobile',
        sort: 4
      }

    ];

    mediaKeys.forEach(key => {
      if (slider[key.desktopImage]) {
        this[key.desktopImage] = new MediaEntity(slider[key.desktopImage]);
      }

      if (slider[key.mobileImage]) {
        this[key.mobileImage] = new MediaEntity(slider[key.mobileImage]);
      }
    });
  }
}
