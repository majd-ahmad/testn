import { SessionDomain } from '../domain/session.domain';
import { CreateSessionDto } from '../model/CreateSession.dto';

export interface ISessionRepository {
  findSessionById(sessionId: number): Promise<SessionDomain>;
  createSession(createSessionDto: CreateSessionDto): Promise<SessionDomain>;

  deleteSession(accountId: string, sessionId?: number): Promise<void>;
}

export const ISessionRepositoryToken = Symbol('ISessionRepository');
