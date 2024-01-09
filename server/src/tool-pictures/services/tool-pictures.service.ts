import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createWriteStream } from 'fs';
import { Multer } from 'multer';
import { Express } from 'express';
import { unlink } from 'fs/promises';
import { ToolPicture } from 'src/typeorm/entities/ToolPicture';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToolsService } from 'src/tools/tools.service';
import { Tool } from 'src/typeorm/entities/Tool';

@Injectable()
export class ToolPicturesService {
  constructor(@InjectRepository(ToolPicture) private toolPicRepo: Repository<ToolPicture>, private toolsService: ToolsService) {}

    async uploadFile(file: Express.Multer.File, toolId: number): Promise<string> {
        const fileName = `${Date.now()}${extname(file.originalname)}`;
        const path = `./tool2rent-pictures/${fileName}`;

        const tool: Tool = await this.toolsService.getTool(toolId);
        console.log(tool.PK_tool_id)

        console.log(this.toolPicRepo.create({imageUrl: path, tool: tool}))
    
        const stream = createWriteStream(path);
        stream.write(file.buffer);
        stream.end();
    
        return fileName;
      }
    
      async deleteFile(filePath: string): Promise<void> {
        try {
          await unlink(filePath);
        } catch (error) {
          throw new Error(`Failed to delete file: ${error.message}`);
        }
      }
}
