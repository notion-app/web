import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import LoginManager from 'util/LoginManager';

@createActions(flux)
class LoginActions {
  constructor() {
  }

  login(fbInfo) {
    LoginManager.login(fbInfo);
    this.dispatch(LoginManager.getAuthInfo());
  }

  logout() {
    LoginManager.logout();
    this.dispatch();
  }
}

export default LoginActions;
