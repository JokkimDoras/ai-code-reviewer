import { Controller, Get, Post, Delete, Param, Request, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('projects/:projectId/files')
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get()
  getFiles(@Param('projectId') projectId: string) {
    return this.filesService.getFiles(projectId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(
    @Param('projectId') projectId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.filesService.uploadFiles(projectId, files);
  }

  @Delete(':fileId')
  deleteFile(@Param('fileId') fileId: string) {
    return this.filesService.deleteFile(fileId);
  }
}