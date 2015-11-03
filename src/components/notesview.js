import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import NotebookStore from 'stores/NotebookStore';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import NotebookActions from 'actions/NotebookActions';
import NotionNavBar from 'components/ui/notionNavBar';
import LoginManager from 'util/LoginManager';
import { Input, Modal, Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';
import _ from 'lodash';
import Dock from 'react-dock';

require('../css/landingpage.css');
require('../css/notesview.css');
@connectToStores
class NotesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:LoginManager.getAuthInfo(),
      notebookId: props.params.notebookId,
      noteBookStore: {
        joinedNotes:[],
        unJoinedNotes:[]
      },
      windowStore:{
        width:window.innerWidth,
        height:window.innerHeight
      },
      addNoteModalVisable: false,
      noteName:'',
      selectedTopicId: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onWindowChange = this.onWindowChange.bind(this);
    this.onJoinedNoteClick = this.onJoinedNoteClick.bind(this);
    this.onUnjoinedNoteClick = this.onUnjoinedNoteClick.bind(this);
    this.onNewNoteClick = this.onNewNoteClick.bind(this);
    this.validateName = this.validateName.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onModalclose = this.onModalclose.bind(this);
    this.onCreateNote = this.onCreateNote.bind(this);
    this.renderJoinedNotes = this.renderJoinedNotes.bind(this);
    this.onJoinedNoteDeleteClick = this.onJoinedNoteDeleteClick.bind(this);
  }

  componentWillMount() {
      document.body.style.backgroundImage = null;
  }

  componentDidMount(){
    NotebookStore.listen(this.onChange);
    WindowStore.listen(this.onWindowChange);
    NotebookActions.getUnjoinedNotes(this.state.notebookId, this.state.user.fbData.fb_auth_token);
    NotebookActions.getJoinedNotes(this.state.notebookId, this.state.user.fbData.fb_auth_token);

    window.addEventListener("resize", this.updateWindowDimensions);
  }

  shouldComponentUpdate(nextProps,nextState){
    /*
    if(this.state.addNoteModalVisable != nextState.addNoteModalVisable){
      return true;
    }

    else if(this.state.noteBookStore.notebooks.length != nextState.noteBookStore.notebooks.length ){
      return true
    }


    else if(this.state.noteName.length != nextState.noteName.length){
      return true;
    }

    else if(this.state.windowStore.width != nextState.windowStore.width){
      return true;

    }

    return false;
    */
    return true;
  }

  onWindowChange(){
    this.setState({windowStore:WindowStore.getState()});
  }

  updateWindowDimensions(e){
    WindowActions.setDimensions({width:window.innerWidth, height:window.innerHeight});
  }

  onChange(){
    this.setState({noteBookStore:NotebookStore.getState()});
  }

  onNewNoteClick(){
    this.setState({addNoteModalVisable: true});
  }

  onNameChange(){
    this.setState({noteName:this.refs.input.getValue()});
  }

  validateName(){
    let length = this.state.noteName.length;
    if(length >0) return 'success';
    else return 'error';
  }

  onModalclose() {
    this.setState({ addNoteModalVisable: false });
  }

  onCreateNote(){
    if(this.state.selectedTopicId === ""){
      NotebookActions.createNote(this.state.notebookId, this.state.user.fbData.fb_auth_token, this.state.noteName);
      this.setState({addNoteModalVisable:false, noteName:''});
    } else {
      NotebookActions.createNoteBasedOffTopic(this.state.notebookId, this.state.user.fbData.fb_auth_token, this.state.noteName, this.state.selectedTopicId);
      this.setState({addNoteModalVisable:false, noteName:'', selectedTopicId:''});
    }

  }


  static getStores(props) {
    return [NotebookStore, WindowStore];
  }

  static getPropsFromStores(props) {
    return NotebookStore.getState();
  }

  handleVisibleChanged(isVisible){
  this.setState({ detailDockVisable:isVisible });
}

onJoinedNoteDeleteClick(index){
  let note = this.state.noteBookStore.joinedNotes[index-1];
  let notebook_id = this.state.notebookId;
  let note_id = note.notes[0].id;
  let token = this.state.user.fbData.fb_auth_token;
  NotebookActions.deleteNote(notebook_id, note_id, token);
}

  onJoinedNoteClick(index){
    let note = this.state.noteBookStore.joinedNotes[index-1];
    let location = `${window.location.pathname}/note/${note.notes[0].id}/edit`;
    window.location.replace(location);
  }

  onUnjoinedNoteClick(index){
    let note = this.state.noteBookStore.unJoinedNotes[index-1];
    console.log(note);
    this.setState({selectedTopicId: note.id, addNoteModalVisable:true });
    //let location = `${window.location.pathname}/note/${index-1}/edit`;
    //window.location.replace(location);
  }

  renderJoinedNotes() {
    let notes = this.state.noteBookStore.joinedNotes;
    let chunks = this.state.windowStore.width <= 991? _.chunk(notes,2): _.chunk(notes,3);
    let childKey = 0;
    let rowKey = 0;
    let notebookViews = _.map(chunks, (notes,index) =>{
      let notebookChildren = _.map(notes, (note,notebookIndex)=>{
        childKey = childKey+1;
          let n = _.find(note.notes, (note) => {
            return note.title !== "";
          });
          return (
            <Col xs={12} md={4} key={childKey} className='notebookcol'>
              <Panel className='joined-note-panel' header={ <h3> {n.title}<Glyphicon onClick={this.onJoinedNoteDeleteClick.bind(this,childKey)} className="pull-right removeNotebookIcon" glyph="remove" /> </h3> } bsStyle="primary">
                <Thumbnail onClick={this.onJoinedNoteClick.bind(this,childKey)} className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                {note.preview}
              </Panel>
            </Col>
          );
      });
      rowKey = rowKey+1;
      return (
        <Row className='show-grid' key={rowKey}>
          {notebookChildren}
        </Row>
      )
    });
    return notebookViews;
  }

  renderNotes() {
    let emptyNoteHolder = {
      title: '__add_new_note__',
    };
    let notes = this.state.noteBookStore.unJoinedNotes;
    notes = notes.concat(emptyNoteHolder);
    let chunks = this.state.windowStore.width <= 991? _.chunk(notes,2): _.chunk(notes,3);
    let childKey = 0;
    let rowKey = 0;
    let notebookViews = _.map(chunks, (notes,index) =>{
      let notebookChildren = _.map(notes, (note,notebookIndex)=>{
        childKey = childKey+1;
        if(note.title === '__add_new_note__'){
          return (
            <Col xs={12} md={4} key={childKey} className='notebookcol'>
              <Panel header={ <h3> Add New Notebook </h3> } bsStyle="default" className='addNewNotebookPanel' onClick={this.onNewNoteClick}>
                <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn0.iconfinder.com/data/icons/math-business-icon-set/93/1_1-512.png"/>
                  <div>
                    <Modal show={this.state.addNoteModalVisable} onHide={this.onModalclose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Add New Note</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Input
                          type="text"
                          value={this.state.noteName}
                          label="Note name"
                          bsStyle={this.validateName()}
                          hasFeedback
                          ref="input"
                          groupClassName="group-class"
                          labelClassName="label-class"
                          onChange={this.onNameChange} />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={this.onCreateNote}>Add Note</Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
              </Panel>
            </Col>
          )
        } else {
          let n = _.find(note.notes, (note) => {
            return note.title !== "";
          });
          return (
            <Col xs={12} md={4} key={childKey} className='notebookcol'>
              <Panel className='note-panel' header={ <h3> {n.title} </h3> } bsStyle="primary" onClick={this.onUnjoinedNoteClick.bind(this,childKey)}>
                <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                {note.preview}
              </Panel>
            </Col>
          );
        }
      });
      rowKey = rowKey+1;
      return (
        <Row className='show-grid' key={rowKey}>
          {notebookChildren}
        </Row>
      )
    });
    return notebookViews;
  }

  render() {
    //console.log(this.state);
    let notebookViews = this.renderNotes();
    //let notebook = this.state.noteBookStore.notebooks[this.state.notebookId];
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
        <div><h1><Label className='notebook-label'>{this.state.notebookId}</Label></h1></div>
        <Grid>
          {this.renderJoinedNotes()}
          {notebookViews}
        </Grid>
      </div>
    );
  }

}

export default NotesView;
