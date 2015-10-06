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
        lastEdit: 'Last edited: 1:47 pm',
        notes:[
          {
            title:'Note 1',
            preview:'This is a preview'
          },
          {
            title:'Note 2',
            preview:'This is a preview'
          },
          {
            title:'Note 3',
            preview:'This is a preview'
          },
          {
            title:'Note 4',
            preview:'This is a preview'
          },
        ],
      },
      {
        title: 'ECON 491',
        lastEdit: 'Last edited: 6:54 pm',
        notes:[
          {
            title:'Note 1',
            preview:'This is a preview'
          },
          {
            title:'Note 2',
            preview:'This is a preview'
          },
          {
            title:'Note 3',
            preview:'This is a preview'
          },
          {
            title:'Note 4',
            preview:'This is a preview'
          },
        ],
      },
      {
        title: 'PHYS 272',
        lastEdit: 'Last edited: 1:47 pm',
        notes:[
          {
            title:'Note 1',
            preview:'This is a preview'
          },
          {
            title:'Note 2',
            preview:'This is a preview'
          },
          {
            title:'Note 3',
            preview:'This is a preview'
          },
          {
            title:'Note 4',
            preview:'This is a preview'
          },
        ],
      },
      {
        title: 'CS 490',
        lastEdit: 'Last edited: 1:47 pm',
        notes:[
          {
            title:'Note 1',
            preview:'This is a preview'
          },
          {
            title:'Note 2',
            preview:'This is a preview'
          },
          {
            title:'Note 3',
            preview:'This is a preview'
          },
          {
            title:'Note 4',
            preview:'This is a preview'
          },
        ],
      },
      {
        title: 'ECON 451',
        lastEdit: 'Last edited: 1:47 pm',
        notes:[
          {
            title:'Note 1',
            preview:'This is a preview'
          },
          {
            title:'Note 2',
            preview:'This is a preview'
          },
          {
            title:'Note 3',
            preview:'This is a preview'
          },
          {
            title:'Note 4',
            preview:'This is a preview'
          },
        ],
      },
      {
        title: '__add_new_notebook__',
        lastEdit: '__NA__,',
        notes:[],
      }
    ]
    this.dispatch(notebooks);
  }

}

export default NotebookActions;
