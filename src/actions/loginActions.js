import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import LoginManager from 'util/LoginManager';
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

    $.ajax({
      url:'http://notion-api-dev.herokuapp.com/v1/login',
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
