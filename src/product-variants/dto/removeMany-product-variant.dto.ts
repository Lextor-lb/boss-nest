import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class RemoveManyProductVariantDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
