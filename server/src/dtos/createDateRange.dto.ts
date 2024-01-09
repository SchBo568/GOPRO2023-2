import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';

export class CreateDateRangeDto {
  @IsNotEmpty()
  start: Date;

  @IsNotEmpty()
  end: Date;

  @IsString()
  @IsNotEmpty()
  mode: string

  @IsNumber()
  @IsNotEmpty()
  toolId: number;
}