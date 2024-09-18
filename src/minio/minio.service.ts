import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as dotenv from 'dotenv';
import * as sharp from 'sharp'; // Import sharp for image manipulation

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
    file: Express.Multer.File,
    oldFileName?: string,
    size: number = 2048, // Default width for resizing
  ): Promise<string> {
    try {
      if (!file || !file.buffer) {
        throw new Error('File buffer is missing');
      }

      // Resize the image using sharp
      const resizedBuffer = await sharp(file.buffer)
        .resize(size) // Resize to the desired dimensions
        .toBuffer();

      const timestamp = Date.now();
      const objectName = `${timestamp}_${file.originalname}`;

      // Upload the resized file
      await this.minioClient.putObject(
        process.env.MINIO_BUCKET_NAME,
        objectName,
        resizedBuffer,
      );

      // After successfully uploading the new file, delete the old one if it exists
      if (oldFileName) {
        await this.deleteFile(oldFileName);
      }

      return objectName;
    } catch (error) {
      console.log(error);
      throw new Error('File upload failed');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(
        process.env.MINIO_BUCKET_NAME,
        fileName,
      );
      console.log(`File ${fileName} deleted successfully`);
    } catch (error) {
      console.log(`Failed to delete file ${fileName}:`, error);
      throw new Error('Failed to delete old file');
    }
  }
}
