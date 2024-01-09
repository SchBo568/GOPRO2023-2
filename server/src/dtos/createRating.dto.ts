import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';

export class CreateRatingDto {
  
    @IsNumber()
    @IsNotEmpty()
    stars: number

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsNotEmpty()
    timestamp: Date

    @IsNumber()
    @IsNotEmpty()
    reviewingUserId: string

    @IsNumber()
    @IsNotEmpty()
    reviewedUserId: string
}