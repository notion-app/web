import React from 'react';
import { Col, Panel, Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row} from 'react-bootstrap';
import NotionNavBar from 'components/ui/notionNavBar';
import LoginManager from 'util/LoginManager';
import LoginStore from 'stores/loginStore';
import LoginActions from 'actions/loginActions';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import connectToStores from 'alt/utils/connectToStores';
import NotebookStore from 'stores/NotebookStore';
import NotebookActions from 'actions/NotebookActions';
import Dock from 'react-dock';
import marked from 'marked';
import _ from 'lodash';

require('../css/EveryoneNote.css');
class EveryoneNoteView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: LoginManager.getAuthInfo(),
      notebookId: props.params.notebookId,
      topicId: props.params.topicId,
      noteBookStore:{
        joinedNotes:[],
        unJoinedNotes:[],
        allNotes:[],
      }
    }
    this.renderUnjoinednotes = this.renderUnjoinednotes.bind(this);
    this.onNoteClick = this.onNoteClick.bind(this);
  }

  onNoteClick(index){
    let notes =_.result(_.find(this.state.noteBookStore.allNotes, (note) => {
      return note.id === this.state.topicId;
    }), 'notes');

    let note = notes[index];
    console.log(note);
    location = `/notebooks/${this.state.notebookId}/note/${note.id}/edit/:previewMode`
  }

  renderUnjoinednotes(){
    let notes =_.result(_.find(this.state.noteBookStore.allNotes, (note) => {
      return note.id === this.state.topicId;
    }), 'notes');

    let noteChildren = _.map(notes, (note, index) => {
      return (
        <Col xs={12} md={4} className='notecol'  key={index}>
          <Panel className="notes-panel" header={<h3>{note.title}</h3>} bsStyle='primary' onClick={this.onNoteClick.bind(this,index)}>
            <div dangerouslySetInnerHTML={{ __html: marked(_.trunc(note.content,40))}}>
            </div>
          </Panel>
        </Col>
      );
    });
    return noteChildren;
  }

  componentDidMount() {
    NotebookStore.listen(() => {
      this.setState({noteBookStore:NotebookStore.getState()});
    });

    NotebookActions.getAllNotes(this.state.notebookId, this.state.user.fbData.fb_auth_token);
  }

  render(){
    return (
      <div>
        <NotionNavBar name='Notion' style='fixedTop'/>
        {this.renderUnjoinednotes()}
      </div>
    );
  }
}

export default EveryoneNoteView;
