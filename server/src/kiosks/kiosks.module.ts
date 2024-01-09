import { Module } from '@nestjs/common';
import { KiosksController } from './kiosks.controller';
import { KiosksService } from './kiosks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kiosk } from 'src/typeorm/entities/Kiosk';

@Module({
  imports: [TypeOrmModule.forFeature([Kiosk]), KiosksModule],
  controllers: [KiosksController],
  providers: [KiosksService],
  exports: [KiosksService]
})
export class KiosksModule {}
