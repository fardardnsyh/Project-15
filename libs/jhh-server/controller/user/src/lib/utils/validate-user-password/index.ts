import bcrypt from 'bcrypt';

const validateUserPassword = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export default validateUserPassword;
