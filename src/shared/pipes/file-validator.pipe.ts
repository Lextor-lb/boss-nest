import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidatorPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    if (!value) {
      throw new BadRequestException('No image file uploaded');
    }

    // Additional validation checks (e.g., size, mimetype)
    if (value.size > 1024 * 1024 * 5) {
      // 5 MB limit
      throw new BadRequestException('Image file size exceeds 5MB');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException('Invalid image file type');
    }

    return value;
  }
}
