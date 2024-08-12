import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    couponId: string;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const [day, month, year] = value.split('-');
      return new Date(`${year}-${month}-${day}`);
    }
    return value;
  })
  expiredDate: Date;

    @IsOptional()
    isArchived: Date | null;

    @IsOptional()
    createdByUserId: number | null;

    @IsOptional()
    updatedByUserId: number | null;
}
