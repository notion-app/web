import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import LoginManager from 'util/LoginManager';

@createActions(flux)
class DummyActions {
  constructor() {
    this.generateActions('updateName', 'updateLogin');
  }
  updateAuthInfo (fbInfo) {
    LoginManager.login(fbInfo);
    this.dispatch(LoginManager.getAuthInfo());
  }

}

export default DummyActions;
