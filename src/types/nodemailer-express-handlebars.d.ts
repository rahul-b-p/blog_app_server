import 'nodemailer';

declare module 'nodemailer/lib/mailer' {
  interface Options {
    template?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context?: Record<string, any>;
  }
}
