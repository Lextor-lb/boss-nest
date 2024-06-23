// file-utils.ts

import * as fs from 'fs';
import * as path from 'path';

export const deleteFile = (fileUrl: string) => {
  const filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    path.basename(fileUrl),
  );
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    } else {
      console.log(`Successfully deleted file: ${filePath}`);
    }
  });
};
