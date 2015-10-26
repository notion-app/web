import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import API_ROOT from 'util/RouteDetails';
import $ from 'jquery';
import LoginManager from 'util/LoginManager';


@createActions(flux)
class SchoolActions {
  constructor() {
  }

  fetchSchools(){
    let path = `${API_ROOT}/school`
    $.ajax({
      url:path,
      crossDomain:true,
      method:'GET',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((schools) => {
      this.dispatch(schools);
    });
  }

  setUserSchool(user_id,token, school_id){
    let authInfo = LoginManager.getAuthInfo();
    authInfo.fbData.school_id = school_id;
    LoginManager.login(authInfo);
    let path = `${API_ROOT}/user/${user_id}/school?token=${token}`;
    let body = {
      'school':school_id
    };
    return $.ajax({
      url:path,
      crossDomain:true,
      method:'PUT',
      data:JSON.stringify(body),
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done (() => {
      this.dispatch();
    });
  }

}

export default SchoolActions;
