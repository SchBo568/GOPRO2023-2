import { Module } from '@nestjs/common';
import { DateRangesController } from './controller/date-ranges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateRange } from 'src/typeorm/entities/DateRange';
import { ToolsService } from 'src/tools/tools.service';
import { ToolsModule } from 'src/tools/tools.module';
import { Repository } from 'typeorm';
import { Tool } from 'src/typeorm/entities/Tool';
import { DateRangesService } from './service/date-ranges.service';

@Module({
  imports: [TypeOrmModule.forFeature([DateRange]), TypeOrmModule.forFeature([Tool]), ToolsModule],
  controllers: [DateRangesController],
  providers: [DateRangesService],
  exports: [DateRangesService]
})
export class DateRangesModule {}
