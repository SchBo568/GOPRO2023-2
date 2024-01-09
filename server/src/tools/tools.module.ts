import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from 'src/typeorm/entities/Tool';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { KiosksService } from 'src/kiosks/kiosks.service';
import { KiosksModule } from 'src/kiosks/kiosks.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { DateRangesModule } from 'src/date-ranges/date-ranges.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tool]), UsersModule, KiosksModule, CategoriesModule],
  providers: [ToolsService],
  controllers: [ToolsController],
  exports: [ToolsService]
})
export class ToolsModule {}