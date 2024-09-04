export type MailConfig = {
  aws_region?: string;
  aws_ses_access_key?: string;
  aws_ses_secret_key?: string;
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
};
