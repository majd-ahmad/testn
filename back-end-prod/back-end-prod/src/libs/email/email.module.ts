import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './mailer.service';
import { I18nService } from 'nestjs-i18n';

import { IEmailtoken } from './IEmail';
import { AllConfigType } from 'src/app/config/config.type';
import { I18nModule } from '../i18n';
import { SES } from 'aws-sdk';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule, I18nModule],
      useFactory: (
        configService: ConfigService<AllConfigType>,
        i18nService: I18nService,
      ) => ({
        transport: {
          SES:
            process.env.NODE_ENV === 'production' &&
            process.env.USE_SES &&
            new SES({
              region: configService.get('mail.aws_region', { infer: true }),
              accessKeyId: configService.get('mail.aws_ses_access_key', {
                infer: true,
              }),
              secretAccessKey: configService.get('mail.aws_ses_secret_key', {
                infer: true,
              }),
            }),
          host: configService.get('mail.host', { infer: true }),
          port: configService.get('mail.port', { infer: true }),
          ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
          secure: configService.get('mail.secure', { infer: true }),
          requireTLS: configService.get('mail.requireTLS', { infer: true }),
          auth: {
            user: configService.get('mail.user', { infer: true }),
            pass: configService.get('mail.password', { infer: true }),
          },
        },
        defaults: {
          from: configService.get('mail.defaultEmail', { infer: true }),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter({ t: i18nService.hbsHelper }),
        },
        options: {
          partials: {
            dir: join(__dirname, 'templates', 'partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
      inject: [ConfigService, I18nService],
    }),
  ],
  providers: [{ provide: IEmailtoken, useClass: EmailService }],
})
export class EmailModule {}
