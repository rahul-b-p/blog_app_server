import { configureUserMapping } from "./user.mapper";

export const initializeMapping = () => {
  configureUserMapping();
};

export * from "./mapper";
