import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class RemoveManyProductSizingDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
