import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import API_ROOT from 'util/RouteDetails';
import $ from 'jquery';


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
    let path = `${API_ROOT}/user/${user_id}/school?token=${token}`;
    let body = {
      'school':school_id
    };
    return $.ajax({
      url:path,
      headers: {
        'Access-Control-Request-Headers': '*',
        'Access-Control-Request-Method': '*',
      },
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
