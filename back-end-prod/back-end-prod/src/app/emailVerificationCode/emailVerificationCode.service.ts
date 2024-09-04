import { Injectable } from '@nestjs/common';
import { EmailVerificationCode, Prisma } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class EmailVerificationCodeService {
  constructor(private prisma: DatabaseService) { }

  async createEmailVerificationCode(
    data: Prisma.EmailVerificationCodeCreateInput,
  ): Promise<EmailVerificationCode> {
    return this.prisma.emailVerificationCode.create({
      data,
    });
  }
  async setEmailVerificationCodeUsed(
    accountId: string,
  ): Promise<EmailVerificationCode> {
    const lastAccountCode = await this.getLatestByAccountId(accountId)
    return this.prisma.emailVerificationCode.update({
      where: { id: lastAccountCode.id },
      data: { used: true },
    });
  }

  async getLatestByAccountId(
    accountId: string,
  ): Promise<EmailVerificationCode> {
    return (await this.prisma.emailVerificationCode.findMany({
      where: {
        accountId: accountId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    }))[0];
  }
}
