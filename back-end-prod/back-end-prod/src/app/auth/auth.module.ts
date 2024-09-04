import { PassportModule } from '@nestjs/passport';
import { AccountModule } from '../account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Logger, Module } from '@nestjs/common';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { AnonymousStrategy } from './strategy/anonymous.strategy';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from '../session/session.module';
import { EmailModule, EmailService, IEmailtoken } from 'src/libs/email';
import { AccountRegisteredEvent } from './events/AccountRegisteredEvent';
import { ForgetPasswordEvent } from './events/ForgetPasswordEvent';
import { UpdatePasswordEvent } from './events/UpdatePasswordEvent';
import { PasswordService } from 'src/libs/passwords.service';
import { EmailVerificationCodeModule } from '../emailVerificationCode/emailVerificationCode.module';

const events = [
  AccountRegisteredEvent,
  ForgetPasswordEvent,
  UpdatePasswordEvent,
];
@Module({
  imports: [
    EmailVerificationCodeModule,
    EmailModule,
    ConfigModule,
    AccountModule,
    PassportModule,
    SessionModule,
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...events,
    PasswordService,
    Logger,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
    { provide: IEmailtoken, useClass: EmailService },
  ],
})
export class AuthModule { }
