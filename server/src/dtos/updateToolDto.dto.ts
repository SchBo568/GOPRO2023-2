import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';

export class UpdateToolDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsNumber()
  @IsOptional()
  rental_rate: number;

  @IsString()
  @IsOptional()
  condition: string;

  @IsNumber()
  @IsOptional()
  categoryPKCategoryId: number;

  @IsString()
  @IsOptional()
  userPKUsername: string;

  @IsNumber()
  @IsOptional()
  kioskPKLocationId: number;
}
