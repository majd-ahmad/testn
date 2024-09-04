import { SessionDomain } from 'src/app/session/domain/session.domain';
export type JwtRefreshPayloadType = {
  sessionId: SessionDomain['id'];
  iat: number;
  exp: number;
};
