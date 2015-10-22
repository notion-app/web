import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import LoginManager from 'util/LoginManager';
import API_ROOT from 'util/RouteDetails';
import $ from 'jquery';

@createActions(flux)
class LoginActions {
  constructor() {
  }

  login(fbInfo) {

    let postBody = {
      'auth_method':'facebook',
      'access_token': fbInfo.accessToken
    };

    let path = `${API_ROOT}/login`
    $.ajax({
      url:path,
      crossDomain:true,
      method:'POST',
      data:JSON.stringify(postBody),
      dataType:"json",
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((loginData) => {
      LoginManager.login(loginData);
      this.dispatch(LoginManager.getAuthInfo());
    });
  }

  logout() {
    LoginManager.logout();
    this.dispatch();
  }
}

export default LoginActions;
