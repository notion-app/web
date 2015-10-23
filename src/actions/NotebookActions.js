import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import LoginManager from 'util/LoginManager';
import API_ROOT from 'util/RouteDetails';
import $ from 'jquery';



@createActions(flux)
class NotebookActions {
  constructor() {
  }

  fetchNotebooks(user_id, token){
    let path = `${API_ROOT}/user/${user_id}/subscription?token=${token}`
    $.ajax({
      url:path,
      crossDomain:true,
      method:'GET',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((notebooks) => {
      this.dispatch(notebooks);
    });
  }

  addNotebook(notebook){
    this.dispatch(notebook);
  }

  subscribeToNotebook(user_id, token, notebook_id){
    let postBody = {
      'notebook_id':notebook_id,
      'name':'A dumb ass notebook'
    };

    let path = `${API_ROOT}/user/${user_id}/subscription?token=${token}`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'POST',
      data:JSON.stringify(postBody),
      dataType:"json",
      error: function(xhr,options,error){
        console.log('JQ ERROR');
        console.log(error);
      }
    }).done ((notebook) => {
      this.dispatch(notebook);
    });

  }

}

export default NotebookActions;
