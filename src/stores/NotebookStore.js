import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/NotebookActions';

@createStore(flux)
class NotebookStore {
  notebooks = []

  @bind(actions.fetchNotebooks)
  onFetchNotebooks(loadedNotebooks){
    this.notebooks = this.notebooks.concat(loadedNotebooks.subscriptions);
  }

  @bind(actions.addNotebook)
  onAddNotebook(notebook){
    this.notebooks = this.notebooks.concat(notebook);
  }

  @bind(actions.subscribeToNotebook)
  onSubscribe(notebook){
    this.notebooks = this.notebooks.concat(notebook);
  }
}

export default NotebookStore;
