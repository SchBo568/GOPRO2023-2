import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    PK_username: string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    firstname: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastname: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone_number: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    birthdate: Date;


    @ApiProperty()
    @IsString()
    @IsOptional()
    access_token: string
}