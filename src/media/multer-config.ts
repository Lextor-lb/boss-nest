import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { BadRequestException } from '@nestjs/common';

const uploadDestination = resolve(__dirname, '..', '..', '..', 'uploads');
const allowedImageTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
];
const maxFileSize = 2000 * 1024; // 2MB

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
