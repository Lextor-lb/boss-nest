import { Exclude } from 'class-transformer';
import { IsUrl, IsNumber, IsPositive } from 'class-validator';

export class Slider {

constructor(partial: Partial<Slider>) {
    Object.assign(this, partial);
    }
    
  @IsNumber()
  @IsPositive()
  id: number;

  @IsUrl()
  mobileImage: string;

  @IsUrl()
  desktopImage: string;

  @IsNumber()
  @IsPositive()
  sorting: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdByUserId : number;

  @Exclude()
  updatedByUserId : number;

  @Exclude()
  isArchived: Date;

 
}