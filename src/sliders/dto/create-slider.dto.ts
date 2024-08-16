import { IsNumber, IsPositive, IsArray, IsString } from 'class-validator';

export class CreateSliderDto {
  
    mobileImage: string;
   
    desktopImage: string;

    sorting: string;
}
