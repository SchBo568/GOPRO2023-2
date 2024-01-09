export class CreateToolDto {
  name?: string;
  description?: string;
  status?: string;
  rental_rate?: number;
  condition?: string;
  code?: string;
  userPKUsername?: string;
  kioskPKLocationId?: number;
  categoryId?: number
}