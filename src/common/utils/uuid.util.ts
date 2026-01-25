import { v7 as uuidv7 } from 'uuid';

/**
 * Generates a UUIDv7 string.
 * UUIDv7 is a time-ordered UUID implementation, which is beneficial for database indexing performance.
 * @returns string
 */
export const generateUuid = (): string => {
  return uuidv7();
};
