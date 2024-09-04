import { BadRequestException } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Validate images files uploaded by a request
 *
 * @param {string[]} allowedExtensions - an array of allowed file extensions
 *
 * @returns {Express.Multer.File[]} an array of valid image files
 *
 * @throws {BadRequestException} if no files were uploaded
 * @throws {BadRequestException} if there are no valid images with allowed extensions
 */
export const ValidateImageFiles = createParamDecorator(
    (allowedExtensions: string[], context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const images: Express.Multer.File[] = request.files;

        if (!images?.length) throw new BadRequestException('No files were uploaded');
        // Function to check if a file has allowed extension
        const isAllowedExtension = (fileName: string): boolean => {
            const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
            return allowedExtensions.includes(ext);
        };

        // Filter out files with disallowed extensions
        const validImages = images.filter(image => isAllowedExtension(image.originalname));

        // Check if there are any valid images
        if (!validImages?.length) throw new BadRequestException(`Only ${allowedExtensions} files are allowed.`);

        return validImages;
    },
);

