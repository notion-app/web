 import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import LoginManager from 'util/LoginManager';
import API_ROOT from 'util/RouteDetails';
import $ from 'jquery';



@createActions(flux)
class NotebookActions {
  constructor() {
  }

  countNotesForNotebook(notebooks, user, token){
    let notebookChildren = _.map(notebooks, (n,notebookIndex)=>{
      let notebook_id = n.notebook_id;
      let path = `${API_ROOT}/notebook/${notebook_id}/topic?user=${user}&token=${token}`;
      $.ajax({
        url:path,
        crossDomain:true,
        method:'GET',
        error: function(xhr,options,error){
          console.log(error);
        },
      }).done((notes)=> {
        let noteCount = [{notebook_id: notebook_id, notes: notes.length}];
        this.dispatch(noteCount);
      });
    });
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
      NotebookActions.countNotesForNotebook(notebooks, user_id, token);
    });
  }

  addNotebook(notebook){
    this.dispatch(notebook);
  }

  subscribeToNotebook(user_id, token, notebook_id,name){
    let postBody = {
      notebook_id:notebook_id,
      name:name,
    };

    let path = `${API_ROOT}/user/${user_id}/subscription?token=${token}`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'POST',
      data:JSON.stringify(postBody),
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((notebook) => {
      this.dispatch(notebook);
    });
  }

  unsubscribeToNotebook(user_id, token, notebook_id){
    let path = `${API_ROOT}/user/${user_id}/subscription/${notebook_id}?token=${token}`;
    let body = {
      notebook_id:notebook_id
    }
    $.ajax({
      url:path,
      crossDomain:true,
      method:'DELETE',
      data:JSON.stringify(body),
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done(()=> {
      this.dispatch(notebook_id);
    });

  }

  updateNotebook(user_id, token, notebook_id, name){
    let path = `${API_ROOT}/user/${user_id}/subscription?token=${token}`;
    let body = {
      notebook_id: notebook_id,
      name:name
    };

    $.ajax({
      url:path,
      crossDomain:true,
      method:'PUT',
      data:JSON.stringify(body),
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done((notebook)=> {
      this.dispatch(notebook);
    });
  }

  getSingleNote(notebook_id, note_id, token){
    let path = `${API_ROOT}/notebook/${notebook_id}/note/${note_id}?token=${token}`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'GET',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((note) => {
      this.dispatch(note);
    });
  }

  getJoinedNotes(notebook_id, token){
    let path = `${API_ROOT}/notebook/${notebook_id}/topic?user=true&token=${token}`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'GET',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((notes) => {
      this.dispatch(notes);
    });
  }

  getUnjoinedNotes(notebook_id, token){
    let path = `${API_ROOT}/notebook/${notebook_id}/topic?unjoined=true&token=${token}`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'GET',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((notes) => {
      this.dispatch(notes);
    });
  }

  getAllNotes(notebook_id, token){
    let path = `${API_ROOT}/notebook/${notebook_id}/topic?token=${token}`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'GET',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((notes) => {
      this.dispatch(notes);
    });
  }

  createNoteBasedOffTopic(notebook_id = "" , token, noteTitle, topic_id=""){
    let path = `${API_ROOT}/notebook/${notebook_id}/note?token=${token}`;
    let body = {
      title:noteTitle,
      topic_id:topic_id,
    };

    $.ajax({
      url:path,
      crossDomain:true,
      method:'POST',
      data:JSON.stringify(body),
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done((note)=> {
      console.log(note);
      this.dispatch(note);
    });
  }

  createNote(notebook_id = "" , token, noteTitle, topic_id=""){
    let path = `${API_ROOT}/notebook/${notebook_id}/note?token=${token}`;
    let body = {
      title:noteTitle,
      topic_id:topic_id,
    };

    $.ajax({
      url:path,
      crossDomain:true,
      method:'POST',
      data:JSON.stringify(body),
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done((note)=> {
      this.dispatch(note);
    });
  }

  deleteNote(notebook_id, note_id, token){
    let path = `${API_ROOT}/notebook/${notebook_id}/note/${note_id}?token=${token}`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'DELETE',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done((note)=> {
      this.dispatch(note);
    });
  }

  updateNote(notebook_id, note_id, token, content){
    let path = `${API_ROOT}/notebook/${notebook_id}/note/${note_id}?token=${token}`;
    let body = {
      content:content
    }
    $.ajax({
      url:path,
      crossDomain:true,
      method:'PUT',
      data:JSON.stringify(body),
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done((note)=> {
      this.dispatch(note);
    });
  }

  addRecommendation(recommendation){
    this.dispatch(recommendation);
  }

  removeRecommendation(recommendation){
    this.dispatch(recommendation);
  }
}

export default NotebookActions;
