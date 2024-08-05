import { IsOptional, IsString } from "class-validator";

export class CreateSliderDto {
    @IsOptional()
    @IsString()
    place1Desktop: string;

    @IsOptional()
    @IsString()
    place1Mobile: string;
 
    @IsOptional()
    @IsString()
    place2Desktop: string;

    @IsOptional()
    @IsString()
    place2Mobile: string;
 
    @IsOptional()
    @IsString()
    place3Desktop: string;

    @IsOptional()
    @IsString()
    place3Mobile: string;
 
    @IsOptional()
    @IsString()
    place4Desktop: string;

    @IsOptional()
    @IsString()
    place4Mobile: string;

    @IsOptional()
    createdByUserId: number | null;

    @IsOptional()
    updatedByUserId: number | null;
}
