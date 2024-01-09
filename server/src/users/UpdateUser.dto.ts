import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    birthdate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone_number: string;
}