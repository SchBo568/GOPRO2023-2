import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/typeorm/entities/User';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

require('dotenv').config();
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d'
      }
    })]
})
export class AuthModule { }
