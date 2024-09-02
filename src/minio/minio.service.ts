import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      useSSL: true,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
  ): Promise<string> {

        try {
          if (!file || !file.buffer) {
            throw new Error('File buffer is missing');
          }
      
          const timestamp = Date.now();
          const objectName = `${timestamp}_${file.originalname}`;
      
          await this.minioClient.putObject(bucketName, objectName, file.buffer);
      
          // console.log(`https://${process.env.MINIO_ENDPOINT}/${bucketName}/${objectName}`);
          return objectName;
          
        } catch (error) {
            console.log(error);
        }
  }
}
