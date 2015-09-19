import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/dummyActions';

@createStore(flux)
class DummyStore {
  name = 'awesome';
  userAuth = null;

  @bind(actions.updateName)
  updateName(name) {
    this.name = name;
  }

  @bind(actions.updateAuthInfo)
  updateAuthInfo(auth) {
    console.log('here');
    console.log(auth);
    this.userAuth = auth;
  }
}

export default DummyStore;
