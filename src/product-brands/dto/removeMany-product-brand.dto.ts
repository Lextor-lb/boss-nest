import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class RemoveManyProductBrandDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
