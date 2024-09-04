
export interface IEmailVerificationCode {
  id: string;
  accountId: string;
  digits: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}
export class EmailVerificationCode implements IEmailVerificationCode {
  id: string;
  accountId: string;
  digits: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;

  constructor(data: IEmailVerificationCode) {
    Object.assign(data)
  }
}
