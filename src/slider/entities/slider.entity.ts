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

  @Exclude()
  createAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdByUserId: number;
  @Exclude()
  updatedByUserId: number;

  // createdByUser?: UserEntity;
  // updatedByUser?: UserEntity;

  constructor(slider: any,data: Partial<SliderEntity> = {}) {
    Object.assign(this, data);

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
