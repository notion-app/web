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

  @bind(actions.setUserUsername)
  onSetUsername(auth) {
    this.userAuth = auth;
  }

  @bind(actions.setUserEmail)
  onSetEmail(auth) {
    this.userAuth = auth;
  }

  @bind(actions.setAuthInfo)
  onSetAuthInfo(auth) {
    //this.userAuth = auth;
  }

  @bind(actions.getAuthInfo)
    onGetAuthInfo(auth){
      //this.userAuth = auth;
    }
}

export default LoginStore;
