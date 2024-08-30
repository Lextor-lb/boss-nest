import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class RemoveManyProductCategoryDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
