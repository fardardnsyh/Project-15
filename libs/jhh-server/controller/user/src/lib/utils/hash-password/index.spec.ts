import bcrypt from 'bcrypt';

import hashPassword from '.';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
}));

describe('hashPassword', () => {
  it('should hash the password', async () => {
    const password = 'password';

    const mockHash = jest.spyOn(bcrypt, 'hash');

    const hashedPassword = await hashPassword(password);

    expect(mockHash).toHaveBeenCalledWith(password, 5);
    expect(hashedPassword).toBe('hashed_password');
  });
});
