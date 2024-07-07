import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class RemoveManyProductDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
