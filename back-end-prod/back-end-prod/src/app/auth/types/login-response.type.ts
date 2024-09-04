import { AccountModel } from 'src/app/account/application/model/account';

export type LoginResponseType = Readonly<{
  token: string;
  refreshToken: string;
  tokenExpires: number;
  account: AccountModel;
}>;
