import { createMapper, Mapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { configureUserMapping } from './user.mapper';

// Initialize the mapper with the classes strategy
export const mapper: Mapper = createMapper({
  strategyInitializer: classes(),
});
