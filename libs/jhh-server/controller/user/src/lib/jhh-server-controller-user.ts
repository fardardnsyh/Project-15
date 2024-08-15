import login from './login';
import register from './register';
import removeAccount from './remove-account';

export function JhhServerControllerUser() {
  return {
    login,
    register,
    removeAccount,
  };
}
