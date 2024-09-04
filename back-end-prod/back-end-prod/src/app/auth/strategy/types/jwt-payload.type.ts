import { AccountDomain } from 'src/app/account/domain/account';
import { SessionDomain } from 'src/app/session/domain/session.domain';

export type JwtPayloadType = Pick<AccountDomain, 'id' | 'role'> & {
  sessionId: SessionDomain['id'];
  iat: number;
  exp: number;
};
