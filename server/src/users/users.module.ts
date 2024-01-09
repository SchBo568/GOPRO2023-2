import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Kiosk } from 'src/typeorm/entities/Kiosk';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Kiosk])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
