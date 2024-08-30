import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class RemoveManyProductFittingDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
