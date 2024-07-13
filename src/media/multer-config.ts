import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';

const uploadDestination = resolve(__dirname, '..', '..', '..', 'uploads');
const allowedImageTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
];
const maxFileSize = 8000 * 1024; // 8MB

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadDestination);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: { fileSize: maxFileSize },
  fileFilter: (req, file, callback) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Invalid file type'), false);
    }
  },
};
export const resizeImage = async (filePath: string) => {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    if (metadata.width > 1024) {
      await image.resize(1024).toFile(filePath + '-resized');
      fs.renameSync(filePath + '-resized', filePath);
    }
  } catch (error) {
    console.error('Error resizing image:', error);
    throw new BadRequestException('Error processing image');
  }
};
