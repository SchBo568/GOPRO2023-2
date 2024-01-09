import { PartialType } from '@nestjs/swagger';
import { CreateRentingDto } from './create-renting.dto';

export class UpdateRentingDto extends PartialType(CreateRentingDto) {}
