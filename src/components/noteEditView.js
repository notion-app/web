import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import NotebookStore from 'stores/NotebookStore';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import NotebookActions from 'actions/NotebookActions';
import NotionNavBar from 'components/ui/notionNavBar';
import { Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';
import _ from 'lodash';
import Editor from 'components/ui/editor';
import Dock from 'react-dock';

require('../css/notesEdit.css');
@connectToStores
class NoteEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notebookId: props.params.notebookId,
      noteId: props.params.noteId,
      noteBookStore: {
        notebooks:[]
      },
      windowStore:{
        width:window.innerWidth,
        height:window.innerHeight
      }
    }
    this.onNotebookChange = this.onNotebookChange.bind(this);
    this.renderNoteLabel = this.renderNoteLabel.bind(this);
  }

  componentDidMount(){
    NotebookStore.listen(this.onNotebookChange);
    NotebookActions.fetchNotebooks();
  }

  onNotebookChange(){
    this.setState({noteBookStore:NotebookStore.getState()});
  }

  static getStores(props) {
    return [NotebookStore, WindowStore];
  }

  static getPropsFromStores(props) {
    return NotebookStore.getState();
  }

  renderNoteLabel(){
    if(this.state.noteBookStore.notebooks.length == 0){
      return(null);
    } else {
      let notebook = this.state.noteBookStore.notebooks[this.state.notebookId];
      let note = notebook.notes[this.state.noteId];
      let title = `${notebook.title}-${note.title}`
      return (
        <Label className='noteLabel'>{title}</Label>
      )
    }
  }

  render(){
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
        {this.renderNoteLabel()}
        <Editor/>
      </div>
    )
  }
}
export default NoteEditView;
