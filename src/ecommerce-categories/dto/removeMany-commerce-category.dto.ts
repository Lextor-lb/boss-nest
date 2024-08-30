import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class RemoveManyEcommerceCategoryDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
