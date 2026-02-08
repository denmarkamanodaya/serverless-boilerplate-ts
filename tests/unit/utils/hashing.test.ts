import bcrypt from 'bcrypt';
import { hash } from '../../../src/utils/hashing';

describe('hash()', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('uses HASH_SALT_ROUNDS from env', async () => {
    process.env.HASH_SALT_ROUNDS = '10';

    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed-value');

    const result = await hash('password');

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(result).toBe('hashed-value');
  });

  it('falls back to default salt rounds (12)', async () => {
    delete process.env.HASH_SALT_ROUNDS;

    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'default-hash');

    const result = await hash('password');

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
    expect(result).toBe('default-hash');
  });
});
