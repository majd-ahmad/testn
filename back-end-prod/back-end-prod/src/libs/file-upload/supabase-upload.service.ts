import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { IUploadService } from './IUploadService';
import * as path from 'path';
@Injectable()
export class SupabaseUploadService implements IUploadService {
  private supabase: SupabaseClient;
  setSupabaseClient() {
    try {
      if (process.env.NODE_ENV !== 'production') {
        this.supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SECRET,
        );
      }
    } catch (error) {
      throw new Error('Supabase client is not initialized.', { cause: error });
    }
  }

  async onModuleInit() {
    this.setSupabaseClient();
  }
  async uploadFile(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized.');
    }
    console.log(path.extname(file.originalname).toLowerCase());
    const bucketName =
      path.extname(file.originalname).toLowerCase() === '.pdf'
        ? process.env.PDF_BUCKET
        : process.env.IMAGE_BUCKET;
    const { error } = await this.supabase.storage
      .from(bucketName)
      .upload(file.originalname, file.buffer);
    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    return file;
  }

  async deleteFile(fileName: string): Promise<boolean> {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized.');
    }
    const bucketName =
      path.extname(fileName).toLowerCase() === '.pdf'
        ? process.env.PDF_BUCKET
        : process.env.IMAGE_BUCKET;
    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove([fileName]);
    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    return true;
  }
}
