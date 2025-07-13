import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.BACKBLAZE_REGION,
      endpoint: process.env.BACKBLAZE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.BACKBLAZE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.BACKBLAZE_SECRET_ACCESS_KEY!,
      },
    });
    this.bucketName = process.env.BACKBLAZE_BUCKET_NAME || '';
  }

  async uploadBuffer(buffer: Buffer, fileName: string, contentType = 'image/png'): Promise<string> {
    try {
      
      // Generate a unique file name if not provided
      const uniqueFileName = fileName || `${uuidv4()}${path.extname(fileName) || '.png'}`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: contentType,
      });
      await this.s3.send(command);
      
      // Generate public URL
      const fileUrl = `https://f005.backblazeb2.com/file/${this.bucketName}/${uniqueFileName}`;
      
      console.log(`File uploaded successfully: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file to Backblaze B2:', error);
      throw error;
    }
  }
}
