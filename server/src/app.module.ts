import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Role } from './typeorm/entities/Role';
import { PaymentMethod } from './typeorm/entities/PaymentMethod';
import { Kiosk } from './typeorm/entities/Kiosk';
import { UsersModule } from './users/users.module';
import { ToolsModule } from './tools/tools.module';
import { Tool } from './typeorm/entities/Tool';
import { Review } from './typeorm/entities/Review';
import { UserTool } from './typeorm/entities/UserTool';
import { ReviewsModule } from './reviews/reviews.module';
import { KiosksModule } from './kiosks/kiosks.module';
import { AuthModule } from './auth/auth.module';
import { ToolPicture } from './typeorm/entities/ToolPicture';
import { Category } from './typeorm/entities/Category';
import { DateRange } from './typeorm/entities/DateRange';
import { CategoriesModule } from './categories/categories.module';
import { DateRangesModule } from './date-ranges/date-ranges.module';
import { ToolPicturesModule } from './tool-pictures/tool-pictures.module';




@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '64.226.82.238',
      username: 'gopro',
      password: '!HM^u^V8xRe4f',
      database:'Good2Loan',
      entities: [User, Role, PaymentMethod, Kiosk, Tool, Review, UserTool, ToolPicture, Category, DateRange],
      synchronize: true,
  }), UsersModule, KiosksModule, ReviewsModule, ToolsModule, AuthModule, CategoriesModule, DateRangesModule, ToolPicturesModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
