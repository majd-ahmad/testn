import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ISessionRepositoryToken } from './infrastructure/ISessionRepository';
import { SessionRepository } from './infrastructure/SessionRepository';
import { SessionService } from './application/session.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    SessionService,
    {
      provide: ISessionRepositoryToken,
      useClass: SessionRepository,
    },
  ],
  exports: [
    SessionService,
    {
      provide: ISessionRepositoryToken,
      useClass: SessionRepository,
    },
  ],
})
export class SessionModule {}
