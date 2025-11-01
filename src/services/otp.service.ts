import { errorMessage } from '../constants';
import { Otp } from '../models';
import { logger } from '../utils/logger';
import { handleMongoDBError } from '../utils/mongo-error';

export const getOtpByUser = async (userId: string) => {
  logger.debug(`finding otp for user: ${userId}`);
  try {
    return await Otp.findOne({ user: userId }).exec();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(error.message);
    handleMongoDBError(error);
    throw error;
  }
};

export const createOtp = async (userId: string, otp: string) => {
  logger.debug(`Otp creating for user: ${userId}`);
  try {
    const newOtp = new Otp({ user: userId, otp });
    return await newOtp.save();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`Error while creating otp${error.message}`);
    handleMongoDBError(error);
    throw error;
  }
};

export const deleteOtpById = async (id: string) => {
  logger.debug(`Deleting otp with id: ${id}`);
  try {
    const otp = await Otp.findByIdAndDelete(id);

    if (!otp) {
      throw new Error(errorMessage.OTP_NOT_FOUND);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`Error while deleting otp${error.message}`);
    handleMongoDBError(error);
    throw error;
  }
};
