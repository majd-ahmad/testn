import {
  BadRequestException,
  Controller,
  Inject,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { v4 as uuidv4 } from 'uuid';
import { IUploadService, IUploadServiceToken } from '../../libs/file-upload';
import { AccountProfilePictureService } from './accountProfilePicture.service';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('ProfilePicture')
@Controller('profilePicture')
export class ProfilePictureController {
  constructor(
    @Inject(IUploadServiceToken)
    private readonly uploadService: IUploadService,
    private readonly accountProfilePictureService: AccountProfilePictureService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Put()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async updateProfilePicture(
    @UploadedFile() file,
    @CurrentUser('id') currentUserId,
  ) {
    try {
      if (!file) {
        const deletedProfilePicture = await this.accountProfilePictureService.deleteProfilePicture({
          accountId: currentUserId,
        });
        await this.uploadService.deleteFile(deletedProfilePicture.fileName)
        return;
      }
      const profilePicture = {
        ...file,
        originalname: `${uuidv4()}-${file.originalname}`,
      };
      const uploadedImage = await this.uploadService.uploadFile(profilePicture);

      const userCurrentProfilePicture =
        await this.accountProfilePictureService.accountProfilePicture({
          accountId: currentUserId,
        });

      if (!userCurrentProfilePicture)
        await this.accountProfilePictureService.createProfilePicture({
          fileName: uploadedImage.originalname,
          filesSize: uploadedImage.size,
          uploadDate: new Date(Date.now()),
          account: {
            connect: {
              id: currentUserId,
            },
          },
        });
      else{
        await this.uploadService.deleteFile(userCurrentProfilePicture.fileName);
        await this.accountProfilePictureService.updateUserProfilePicture({
          where: { accountId: currentUserId },
          data: {
            fileName: uploadedImage.originalname,
            filesSize: uploadedImage.size,
            uploadDate: new Date(Date.now()),
          },
        });
      }
    } catch (error) {
      throw new BadRequestException('Cannot upload image', { cause: error });
    }
  }
}
