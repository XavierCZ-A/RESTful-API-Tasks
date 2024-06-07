import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";


export class CreateUserDto {

    @ApiProperty({
        nullable: false,
        example: 'test@gmail.com',
    })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        nullable: false,
        example: 'Ab12345',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        nullable: false,
        example: 'Xavier',
    })
    @IsString()
    @MinLength(3)
    fullName: string;

}