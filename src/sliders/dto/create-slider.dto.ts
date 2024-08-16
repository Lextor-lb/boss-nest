import { IsNumber, IsPositive, IsUrl } from "class-validator";

export class CreateSliderDto {
    @IsUrl()
    mobileImage: string;
  
    @IsUrl()
    desktopImage: string;
  
    @IsNumber()
    @IsPositive()
    sorting: number;
  
}
