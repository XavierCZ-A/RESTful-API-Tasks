import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsOptional, IsString, Min, MinLength } from "class-validator";
import { TaskStatus } from "../entities/task.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {

    @ApiProperty({
        nullable: false,
        example: 'Test task',
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        nullable: false,
        example: 'Test description',
    })
    @IsString()
    description: string;

    @ApiProperty({
        default: TaskStatus.PENDING,
        nullable: false,
        example: 'completed',
    })
    @IsString()
    @IsOptional()
    @IsEnum(TaskStatus, { message: 'Status must be either pending, in progress, or completed' })
    status: string;

    @ApiProperty({
        nullable: false,
        example: '2024-06-19',
    })
    @Type(() => Date)
    @IsDate()
    dateline: Date;

    @ApiProperty({
        example: 'Task comment',
    })
    @IsString()
    @IsOptional()
    comment?: string;

    @ApiProperty({
        example: '["tag1", "tag2"]',
    })
    @IsString({ each: true })
    @IsOptional()
    @IsArray()
    tags?: string[];

}
