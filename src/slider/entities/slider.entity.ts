import { Exclude, Expose, Transform } from 'class-transformer';
import { MediaEntity } from 'src/media';
import { UserEntity } from 'src/users/entities/user.entity';

export class SliderEntity {
  id: number;

  @Expose()
  @Transform(({ obj, key }) => obj[key] ? new MediaEntity(obj[key]).image() : null)
  place1Desktop: string;

  @Expose()
  @Transform(({ obj, key }) => obj[key] ? new MediaEntity(obj[key]).image() : null)
  place1Mobile: string;

  @Expose()
  @Transform(({ obj, key }) => obj[key] ? new MediaEntity(obj[key]).image() : null)
  place2Desktop: string;

  @Expose()
  @Transform(({ obj, key }) => obj[key] ? new MediaEntity(obj[key]).image() : null)
  place2Mobile: string;

  @Expose()
  @Transform(({ obj, key }) => obj[key] ? new MediaEntity(obj[key]).image() : null)
  place3Desktop: string;

  @Expose()
  @Transform(({ obj, key }) => obj[key] ? new MediaEntity(obj[key]).image() : null)
  place3Mobile: string;

  @Expose()
  @Transform(({ obj, key }) => obj[key] ? new MediaEntity(obj[key]).image() : null)
  place4Desktop: string;

  @Expose()
  @Transform(({ obj, key }) => obj[key] ? new MediaEntity(obj[key]).image() : null)
  place4Mobile: string;

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

  constructor(slider: any, data: Partial<SliderEntity> = {}) {
    Object.assign(this, data);

    const mediaKeys = [
      {
        desktopImage: 'place1Desktop',
        mobileImage: 'place1Mobile',
        sort: 1,
      },
      {
        desktopImage: 'place2Desktop',
        mobileImage: 'place2Mobile',
        sort: 2,
      },
      {
        desktopImage: 'place3Desktop',
        mobileImage: 'place3Mobile',
        sort: 3,
      },
      {
        desktopImage: 'place4Desktop',
        mobileImage: 'place4Mobile',
        sort: 4,
      },
    ];

    mediaKeys.forEach(key => {

      if (slider[key.desktopImage]) {
        this[key.desktopImage] = slider[key.desktopImage];
      }

      if (slider[key.mobileImage]) {
        this[key.mobileImage] = slider[key.mobileImage];
      }

      
    });
  }
}

