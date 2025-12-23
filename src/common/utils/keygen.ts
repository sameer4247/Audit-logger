import { randomBytes, createHmac, KeyObject } from 'crypto';

//generates a random hash key for new user
export const generateRawKey = (): string => {
  return `user_${randomBytes(24).toString('hex')}`;
};

export const createHashKey = (key: string): string => {
  const hmacSecret = process.env.HMAC_SECRET;
  if (!hmacSecret) {
    throw new Error('HMAC_SECRET environment variable is not defined');
  }
  return createHmac('sha256', hmacSecret) 
    .update(key)
    .digest('hex');
};