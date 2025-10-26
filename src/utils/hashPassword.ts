import bcrypt from 'bcrypt';
import { logger } from './logger';
import {env} from '../config/env'

export const hashPassword = async (password: string): Promise<string> => {
    logger.debug('Securing the password')
    const functionName = hashPassword.name;
    try {
        const salt = await bcrypt.genSalt(Number(env.HASH_SALT));
        const hashPass = await bcrypt.hash(password, salt);

        return hashPass;
    } catch (error: any) {
        throw new Error(error.message);
    }
};