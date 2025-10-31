import env  from "../config/env";
import { UserRole } from "../enums";
import { userService } from "../services";
import { logger } from "./logger";

export const createDefaultAdmin = async (): Promise<void> => {
  logger.debug("Checking Application admin is exists or not");
  try {
    const admin = await userService.findUserByUsername(env.ADMIN_USERNAME);
    if (admin != null) {
      logger.debug("Admin already exists");
      return;
    }

    const user = await userService.createUser({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      fullName: env.ADMIN_FULLNAME,
      username: env.ADMIN_USERNAME,
      role: UserRole.ADMIN,
    });
    logger.debug(`New Admin created with username:${user.username}`);
  } catch (error) {
    process.exit(1);
  }
};
