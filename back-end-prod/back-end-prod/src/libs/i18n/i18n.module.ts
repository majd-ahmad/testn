import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import {
  I18nModule as NestI18nModule,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { AllConfigType } from 'src/app/config/config.type';
console.log(__dirname);
@Module({
  imports: [
    NestI18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: {
          path: path.join(__dirname),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
  ],
  controllers: [],
})
export class I18nModule {}
