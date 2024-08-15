import bcrypt from 'bcrypt';
import comparePasswords from '.';

describe('comparePasswords function', () => {
  let password: string;
  let hashedPassword: string;

  beforeAll(async () => {
    password = 'somePassword123';
    hashedPassword = await bcrypt.hash(password, 5);
  });

  it('should return true for matching password and hash', async () => {
    const result = await comparePasswords(password, hashedPassword);
    expect(result).toBe(true);
  });

  it('should return false for non-matching password and hash', async () => {
    const result = await comparePasswords('wrongPassword', hashedPassword);
    expect(result).toBe(false);
  });

  it('should return false for empty password', async () => {
    const result = await comparePasswords('', hashedPassword);
    expect(result).toBe(false);
  });

  it('should throw an error for null or undefined password', async () => {
    await expect(
      comparePasswords(null as any, hashedPassword)
    ).rejects.toThrow();
    await expect(
      comparePasswords(undefined as any, hashedPassword)
    ).rejects.toThrow();
  });

  it('should throw an error for null or undefined hash', async () => {
    await expect(comparePasswords(password, null as any)).rejects.toThrow();
    await expect(
      comparePasswords(password, undefined as any)
    ).rejects.toThrow();
  });
});
