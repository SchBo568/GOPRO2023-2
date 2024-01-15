import { IsString, IsEmail, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';

export class CreateDateRangeDto {
  @IsNotEmpty()
  start: Date;

  @IsNotEmpty()
  end: Date;

  @IsNumber()
  @IsNotEmpty()
  toolId: number;
}