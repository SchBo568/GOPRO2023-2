import { IsString, IsNumber, IsNotEmpty, IsEmail, IsPhoneNumber, IsOptional, IsDate } from 'class-validator';
export class UpdateUserDto {

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    firstname: string;

    @IsOptional()
    @IsString()
    lastname: string;

    @IsOptional()
    @IsDate()
    birtdate: Date;

    @IsOptional()
    @IsString()
    phone_number: string;
}