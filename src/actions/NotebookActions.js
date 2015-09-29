import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import LoginManager from 'util/LoginManager';



@createActions(flux)
class NotebookActions {
  constructor() {
  }

  fetchNotebooks(){
    let notebooks = [
      {
        title: 'CS 408',
        lastEdit: 'Last edited: 1:47 pm'
      },
      {
        title: 'ECON 491',
        lastEdit: 'Last edited: 6:54 pm'
      },
      {
        title: 'PHYS 272',
        lastEdit: 'Last edited: 1:47 pm'
      },
      {
        title: 'CS 490',
        lastEdit: 'Last edited: 1:47 pm'
      },
      {
        title: 'ECON 451',
        lastEdit: 'Last edited: 1:47 pm'
      }
    ]
    this.dispatch(notebooks);
  }

}

export default NotebookActions;
