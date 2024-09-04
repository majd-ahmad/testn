import { Inject, Injectable } from '@nestjs/common';
import {
  ISessionRepository,
  ISessionRepositoryToken,
} from '../infrastructure/ISessionRepository';

@Injectable()
export class SessionService {
  constructor(
    @Inject(ISessionRepositoryToken)
    readonly sessionRepository: ISessionRepository,
  ) {}

  async findOne(sessionId: number): Promise<any> {
    return await this.sessionRepository.findSessionById(sessionId);
  }

  async createSession(accountId: string): Promise<number> {
    return (await this.sessionRepository.createSession({ accountId })).id;
  }

  async deleteSession(accountId: string, sessionId?: number): Promise<void> {
    await this.sessionRepository.deleteSession(accountId, sessionId);
  }
}
