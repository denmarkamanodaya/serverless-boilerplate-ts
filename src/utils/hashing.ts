import bcrypt from 'bcrypt';

export const hash = async (data: string): Promise<string> => {
  const SALT_ROUNDS = Number(process.env.HASH_SALT_ROUNDS) || 12;
  return bcrypt.hash(data, SALT_ROUNDS);
};
