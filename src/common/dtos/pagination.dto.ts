import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {

    @ApiProperty({
        example: 5,
        description: 'number of rows needed',
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;
    
    @ApiProperty({
        example: 0,
        description: 'number of rows you need to skip',
    })
    @IsOptional()
    @Type(() => Number)
    offset?: number;

}