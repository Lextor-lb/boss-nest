import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class RemoveManyProductTypeDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
