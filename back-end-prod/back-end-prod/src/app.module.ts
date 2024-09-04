import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app/config/app.config';
import { AccountModule } from './app/account/account.module';
import { ListingModule } from './app/listing/listing.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import authConfig from './app/auth/config/auth.config';
import { AuthModule } from './app/auth/auth.module';
import { SessionModule } from './app/session/session.module';
import { EmailModule } from './libs/email';
import mailConfig from './libs/email/config/mail.config';
import { I18nModule } from './libs/i18n';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypedEventEmitterModule } from './event-emmiter';
import { FileUploadModule } from './libs/file-upload';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './app/healthcheck.controller';
import { HttpModule } from '@nestjs/axios';
import { EmailVerificationCodeModule } from './app/emailVerificationCode/emailVerificationCode.module';
import { AccountProfilePictureModule } from './app/accountProfilePicture/accountProfilePicture.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [authConfig, appConfig, mailConfig],
    }),
    SessionModule,
    AccountModule,
    ListingModule,
    EventEmitterModule.forRoot(),
    TypedEventEmitterModule,
    EmailModule,
    I18nModule,
    FileUploadModule,
    AuthModule,
    TerminusModule,
    HttpModule,
    EmailVerificationCodeModule,
    AccountProfilePictureModule,
  ],

  controllers: [HealthController],
})
export class AppModule {}
