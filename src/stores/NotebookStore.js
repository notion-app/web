import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/NotebookActions';
import CoursesStore from 'stores/CoursesStore';
import LoginStore from 'stores/loginStore';
import _ from 'lodash';

@createStore(flux)
class NotebookStore {
  notebooks = []
  joinedNotes = []
  unJoinedNotes = []

  @bind(actions.fetchNotebooks)
  onFetchNotebooks(loadedNotebooks){
    this.waitFor([LoginStore.dispatchToken, CoursesStore.dispatchToken]);
    this.notebooks = this.notebooks.concat(loadedNotebooks);
  }

  @bind(actions.addNotebook)
  onAddNotebook(notebook){
    this.notebooks = this.notebooks.concat(notebook);
  }

  @bind(actions.subscribeToNotebook)
  onSubscribe(notebook){
    this.notebooks = this.notebooks.concat(notebook);
  }

  @bind(actions.unsubscribeToNotebook)
  onUnsubscribe(notebook_id){
    _.remove(this.notebooks, (notebook) => {
      return notebook.notebook_id == notebook_id;
    });
    this.notebooks = this.notebooks;

  }

  @bind(actions.updateNotebook)
  onUpdateNotebook(notebook){
    let index = _.findIndex(this.notebooks, {notebook_id: notebook.notebook_id});
    this.notebooks[index] = notebook;
  }

  @bind(actions.getJoinedNotes)
  onGetJoinedNotes(notes){
    this.joinedNotes = this.joinedNotes.concat(notes);
  }

  @bind(actions.getUnjoinedNotes)
  onGetUnjoinedNotes(notes){
    this.unJoinedNotes = this.unJoinedNotes.concat(notes);
  }

  @bind(actions.createNote)
  onCreateNote(note){
    this.joinedNotes = this.joinedNotes.concat(note);
  }
}

export default NotebookStore;
