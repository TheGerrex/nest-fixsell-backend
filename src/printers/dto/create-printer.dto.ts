import { Transform } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class CreatePrinterDto {

    @IsString()
    brand:            string;

    @IsString()
    model:            string;

    @IsString()
    description:      string;

    @IsString()
    category_id:      string;

    @IsBoolean()
    @Transform(({ value} ) => value === 'true')
    color:            boolean;

    @IsBoolean()
    @Transform(({ value} ) => value === 'true')
    rentable:         boolean;

    @IsString()
    powerConsumption: string;

    @IsString()
    dimensions:       string;

    @IsString()
    printVelocity:    string;

    @IsString()
    maxPrintSize:     string;

    @IsString()
    maxPaperWeight:   string;

    @IsBoolean()
    @Transform(({ value} ) => value === 'true')
    duplexUnit:       boolean;

    @IsString()
    paperSizes:       string;

    @IsString()
    applicableOS:     string;
}
