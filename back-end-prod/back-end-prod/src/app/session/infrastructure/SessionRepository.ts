import { DatabaseService } from 'src/database/database.service';
import { SessionDomain } from '../domain/session.domain';
import { CreateSessionDto } from '../model/CreateSession.dto';
import { ISessionRepository } from './ISessionRepository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private db: DatabaseService) {}
  async findSessionById(sessionId: number): Promise<SessionDomain> {
    return await this.db.session.findUnique({ where: { id: sessionId } });
  }
  async createSession(
    createSessionDto: CreateSessionDto,
  ): Promise<SessionDomain> {
    return await this.db.session.create({
      data: { accountId: createSessionDto.accountId, deleted: false },
    });
  }
  async deleteSession(accountId: string, sessionId?: number): Promise<void> {
    await this.db.session.update({
      where: {
        id: sessionId || undefined,
        accountId: accountId,
      },
      data: { deleted: true, deletedAt: new Date() },
    });
  }
}
