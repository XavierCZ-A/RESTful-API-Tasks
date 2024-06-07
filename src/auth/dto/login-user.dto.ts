import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {


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
  password: string;
}