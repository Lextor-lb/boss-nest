// file-utils.ts

import * as fs from 'fs';
import * as path from 'path';

// Assuming the 'uploads' directory is at the root of your project
const uploadDir = path.resolve(__dirname, '..', '..', '..', '..', 'uploads');

export const deleteFile = (fileUrl: string) => {
  const filePath = path.join(uploadDir, path.basename(fileUrl));

  // Print the paths to debug
  console.log('Upload Directory:', uploadDir);
  console.log('Resolved File Path:', filePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    } else {
      console.log(`Successfully deleted file: ${filePath}`);
    }
  });
};
