import { Injectable } from '@nestjs/common';
import { AccountProfilePicture, Prisma } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AccountProfilePictureService {
  constructor(private prisma: DatabaseService) {}

  async accountProfilePicture(
    accountProfilePictureWhereUniqueInput: Prisma.AccountProfilePictureWhereUniqueInput,
  ): Promise<AccountProfilePicture | null> {
    return this.prisma.accountProfilePicture.findUnique({
      where: accountProfilePictureWhereUniqueInput,
    });
  }

  async updateUserProfilePicture(params: {
    where: Prisma.AccountProfilePictureWhereUniqueInput;
    data: Prisma.AccountProfilePictureUpdateInput;
  }): Promise<AccountProfilePicture> {
    const { where, data } = params;
    return this.prisma.accountProfilePicture.update({
      data,
      where,
    });
  }

  async createProfilePicture(
    data: Prisma.AccountProfilePictureCreateInput,
  ): Promise<AccountProfilePicture> {
    return this.prisma.accountProfilePicture.create({
      data,
    });
  }

  async deleteProfilePicture(
    where: Prisma.AccountProfilePictureWhereUniqueInput,
  ): Promise<AccountProfilePicture> {
    return this.prisma.accountProfilePicture.delete({
      where,
    });
  }
}
