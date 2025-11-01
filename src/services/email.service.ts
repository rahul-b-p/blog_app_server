import transporter from '../config/nodemailer';
import env from '../config/env';
import { logger } from '../utils/logger';

const sendMail = async (
  receiver: string,
  subject: string,
  template: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: Record<string, any>,
): Promise<void> => {
  try {
    const transportData = await transporter.sendMail({
      from: `"Blog App" <${env.MAIL_APP_USER}>`,
      to: receiver,
      subject,
      template,
      context,
    });

    logger.info(`Mail sent successfully: ${transportData.messageId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`Mail processing failed: ${error.message}`);
  }
};

export const sendOtp = (toAdress: string, username: string, otp: string): void => {
  sendMail(toAdress, 'Verification Email', 'send-otp', { username, otp });
};
