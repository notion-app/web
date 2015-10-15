import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/loginActions';

@createStore(flux)
class LoginStore {
  userAuth = null;

  @bind(actions.login)
  updateAuthInfo(auth) {
    this.userAuth = auth;
  }

  @bind(actions.logout)
  logout() {

  }
}

export default LoginStore;
