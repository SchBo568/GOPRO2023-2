import { Module } from '@nestjs/common';
import { ToolPicturesController } from './controllers/tool-pictures.controller';
import { ToolPicturesService } from './services/tool-pictures.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolPicture } from 'src/typeorm/entities/ToolPicture';
import { ToolsModule } from 'src/tools/tools.module';

@Module({
  imports: [TypeOrmModule.forFeature([ToolPicture]), ToolsModule],
  controllers: [ToolPicturesController],
  providers: [ToolPicturesService]
})
export class ToolPicturesModule {
  
}
