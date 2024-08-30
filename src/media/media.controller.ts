// import {
//   Controller,
//   Post,
//   UploadedFiles,
//   UseInterceptors,
//   BadRequestException,
// } from '@nestjs/common';
// import { AnyFilesInterceptor } from '@nestjs/platform-express';
// import { MediaService } from './media.service';

// @Controller('media')
// export class MediaController {
//   constructor(private readonly mediaService: MediaService) {}

//   @Post('upload')
//   @UseInterceptors(AnyFilesInterceptor())
//   async uploadMedia(@UploadedFiles() files: Express.Multer.File[]) {
//     if (!files || files.length === 0) {
//       throw new BadRequestException('No files uploaded');
//     }

//     const uploadedFiles = files.map(
//       (file) => `/uploads/products/${file.filename}`,
//     );
//     const promises = uploadedFiles.map((url) =>
//       this.mediaService.saveMedia(url, 1),
//     ); // Replace 1 with actual productId

//     await Promise.all(promises);

//     return { message: 'Files uploaded successfully' };
//   }
// }
