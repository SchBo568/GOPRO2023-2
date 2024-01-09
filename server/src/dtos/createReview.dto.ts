import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';

export class CreateReviewDto {
  
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
    toolId: number

    @IsNumber()
    @IsNotEmpty()
    reviewingUserId: string
}