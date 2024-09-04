import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/application/account.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AccountDomain } from '../account/domain/account';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { SessionService } from '../session/application/session.service';
import {
  IEventEmitters,
  IEVENTEMITTERS,
} from 'src/event-emmiter/IEventEmitters';
import { EVENTS } from 'src/event-emmiter/events';
import { PasswordService } from 'src/libs/passwords.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { LoginResponseType } from './types/login-response.type';
import ms from 'ms';
import { EmailVerificationCodeService } from '../emailVerificationCode/emailVerificationCode.service';
import { generateSixDigitCode } from '../../utils/one-time-code';
import { AccountModel } from '../account/application/model/account';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IEVENTEMITTERS) private readonly eventEmitter: IEventEmitters,
    private jwtService: JwtService,
    private accountService: AccountService,
    private sessionService: SessionService,
    private configService: ConfigService<AllConfigType>,
    private passwordService: PasswordService,
    private emailVerificationCodeService: EmailVerificationCodeService,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const account = await this.accountService.findAccountByEmail(
      loginDto.email,
    );
    if (!account) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotFound ',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!account.password) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'wrongCredits',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await this.passwordService.comparePasswords(
      loginDto.password,
      account.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'wrongCredits',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.createTokens(account);
  }

  async createTokens(account: {
    account: AccountModel;
  }): Promise<LoginResponseType> {
    const sessionId = await this.sessionService.createSession(
      account.account.id,
    );

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: account.account.id,
      sessionId: sessionId,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      account: account.account,
    };
  }

  async register(dto: AuthRegisterDto): Promise<LoginResponseType> {
    const registeredAccount = await this.accountService.registerAccount({
      ...dto,
      password: await this.passwordService.hashPassword(dto.password),
    });

    await this.emailVerificationCodeService.createEmailVerificationCode({
      digits: generateSixDigitCode(6),
      account: {
        connect: {
          id: registeredAccount.id,
          email: registeredAccount.email,
          firstName: registeredAccount.firstName,
          lastName: registeredAccount.lastName,
        },
      },
    });
    return await this.createTokens({ account: registeredAccount });
  }

  async confirmEmail(confirmEmailDto: AuthConfirmEmailDto): Promise<void> {
    let accountId: AccountDomain['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: AccountDomain['id'];
      }>(confirmEmailDto.token, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      accountId = jwtData.confirmEmailUserId;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `invalidHash`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const account = await this.accountService.findAccountById(accountId);

    if (!account || account?.isValid === true) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    this.accountService.updateAccountValidity(account.id, true);

    this.eventEmitter.emit(EVENTS.ACCOUNT_CREATED, {
      email: account.email,
      name: `${account.firstName} ${account.lastName}`,
    });
  }

  async verifyAccountByCode(currentUserId) {
    const account = await this.accountService.updateAccountValidity(currentUserId, true);
    this.eventEmitter.emit(EVENTS.ACCOUNT_CREATED, {
      email: account.email,
      name: `${account.firstName} ${account.lastName}`,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const { account } = await this.accountService.findAccountByEmail(email);

    if (!account) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const tokenExpiresIn = this.configService.getOrThrow('auth.forgotExpires', {
      infer: true,
    });

    const hash = await this.jwtService.signAsync(
      {
        forgetAccountId: account.id,
      },
      {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
        expiresIn: tokenExpiresIn,
      },
    );

    this.eventEmitter.emit(EVENTS.ACCOUNT_PASSWORD_FORGET, {
      email: account.email,
      name: `${account.firstName} ${account.lastName}`,
      token: hash,
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let accountId: string;

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: string;
      }>(hash, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });

      accountId = jwtData.forgotUserId;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `invalidHash`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const account = await this.accountService.findAccountById(accountId);

    if (!account) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.accountService.updatePassword(account.id, password);

    this.eventEmitter.emit(EVENTS.ACCOUNT_PASSWORD_RESET, {
      email: account.email,
    });
  }

  private async getTokensData(data: { id: string; sessionId: number }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
