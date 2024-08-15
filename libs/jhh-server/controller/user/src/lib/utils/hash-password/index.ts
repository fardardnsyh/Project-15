import bcrypt from 'bcrypt';

const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 5);
};

export default hashPassword;
