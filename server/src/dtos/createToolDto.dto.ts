import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';

export class CreateToolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  rental_rate: number;

  @IsString()
  @IsNotEmpty()
  condition: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  userPKUsername: string;

  @IsNumber()
  @IsNotEmpty()
  kioskPKLocationId: number;

  @IsString()
  @IsNotEmpty()
  categoryId: number
}
