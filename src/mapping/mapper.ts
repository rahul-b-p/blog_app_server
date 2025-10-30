import { createMapper, Mapper } from '@automapper/core';
import { classes } from '@automapper/classes';

// Initialize the mapper with the classes strategy
export const mapper: Mapper = createMapper({
  strategyInitializer: classes(),
});
