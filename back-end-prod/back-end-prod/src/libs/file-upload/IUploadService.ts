export interface IUploadService {
  uploadFile(file: Express.Multer.File): Promise<Express.Multer.File>;
  deleteFile(fileId: string): Promise<boolean>;
}

export const IUploadServiceToken = Symbol('IUploadService');
