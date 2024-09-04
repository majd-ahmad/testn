export type EmailObject = {
  to: string;
  subject: string;
  template?: string;
  context: Record<string, unknown>;
};

export interface IEmail {
  sendMail(emailObject: EmailObject): Promise<any>;
}

export const IEmailtoken = Symbol('IEmail');
