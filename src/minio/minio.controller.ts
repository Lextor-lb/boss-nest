import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('upload')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    const fileUrl = await this.minioService.uploadFile(bucketName, file);

    return { message: 'File uploaded successfully', url: fileUrl };
  }
}
