import { IsArray, IsDecimal, IsOptional, IsString } from "class-validator";

export class CreateSoftwareDto {

    @IsString()
    name: string;

    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    img_url?: string[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDecimal()
    price?: number;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    tags?: string[];
}
