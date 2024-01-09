import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ToolPicturesService } from '../services/tool-pictures.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tool-pictures')
export class ToolPicturesController {
    constructor(private toolPicturesService: ToolPicturesService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, toolId: number): Promise<string> {
        return await this.toolPicturesService.uploadFile( file, toolId );
    }

    @Delete('upload/:filePath')
    async deleteFile(@Param('filePath') filePath: string): Promise<void> {
        await this.toolPicturesService.deleteFile(filePath);
  }
}
