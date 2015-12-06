import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import NotebookStore from 'stores/NotebookStore';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import NotebookActions from 'actions/NotebookActions';
import NotionNavBar from 'components/ui/notionNavBar';
import LoginManager from 'util/LoginManager';
import { Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';
import _ from 'lodash';
import Editor from 'components/ui/editor';
import Dock from 'react-dock';
import Dragon from 'react-dragon';
import marked from 'marked';

require('../css/notesEdit.css');
@connectToStores
class NoteEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: LoginManager.getAuthInfo(),
      notebookId: props.params.notebookId,
      noteId: props.params.noteId,
      noteBookStore: {
        notebooks:[]
      },
      windowStore:{
        width:window.innerWidth,
        height:window.innerHeight
      },
      ws:null
    }

    let socketUrl = `ws://notion-api-dev.herokuapp.com/v1/note/${props.params.noteId}/ws?token=${LoginManager.getAuthInfo().fbData.fb_auth_token}`;
    this.state.ws = new WebSocket(socketUrl);
    this.state.ws.onopen = this.onWebSocketOnOpen;
    this.state.ws.onclose = this.onWebSocketClose;
    this.state.ws.onerror = this.onWebSocketError;
    this.state.ws.onmessage = this.onWebSocketMessage;

    setInterval(() => {
      this.state.ws.send(JSON.stringify({'type':'ping'}))
    },10000)


    this.onNotebookChange = this.onNotebookChange.bind(this);
    this.renderNoteLabel = this.renderNoteLabel.bind(this);
    this.renderReconmendationPanels = this.renderReconmendationPanels.bind(this);
    this.onItemDrop = this.onItemDrop.bind(this);
    this.onWebSocketOnOpen = this.onWebSocketOnOpen.bind(this);
    this.onWebSocketError = this.onWebSocketError.bind(this);
    this.onWebSocketClose = this.onWebSocketClose.bind(this);
  }

  onWebSocketOnOpen() {
    console.log('web socket open!!');
  }
  onWebSocketError(err) {
    console.log(err);
  }
  onWebSocketMessage(evt){
    console.log(evt.data);

    var message = JSON.parse(evt.data);

    if(message.type === 'recommendation'){
      NotebookActions.addRecommendation(message.recommendation);
    }

  }

  onWebSocketClose(){
    console.log('socket closed');
  }

  componentDidMount(){
    NotebookStore.listen(this.onNotebookChange);
  NotebookActions.getSingleNote(this.state.notebookId, this.state.noteId, this.state.user.fbData.fb_auth_token);
  }

  onNotebookChange(){
    this.setState({noteBookStore:NotebookStore.getState()});
  }

  onDragStart(event, text) {
    console.log(event);
     event.dataTransfer.setData('text', text);
  }

  onItemDrop(transmisson, receiver) {
    console.log('drop');
  }

  static getStores(props) {
    return [NotebookStore, WindowStore];
  }

  static getPropsFromStores(props) {
    return NotebookStore.getState();
  }

  renderNoteLabel(){
    if(this.state.noteBookStore.singleNote !== undefined){
      let title = `${this.state.noteBookStore.singleNote.title}`
      return (
        <Label className='noteLabel'>{title}</Label>
      );
    } else {
      return(null);
    }
  }

  renderReconmendationPanels(){
    console.log(this.state.noteBookStore.recommmendations);
    let recsText = ["*** Kyle ***", "## Hello", "This is a really long string. It contains a lot of content. I hope that it works. Because if it doesn't it will look super ugly and scary and all that stuff",
                   "[link to google](www.google.com)", "```\n code block \n ```", "![alt](https://pbs.twimg.com/profile_images/602426157309517824/EtmL6ZUD.png)" ];
    return _.map(this.state.noteBookStore.recommmendations, (r,index) => {
      return (
          <Panel key={index} draggable="true" onDragStart={(event) => {event.dataTransfer.setData('text', JSON.stringify(r))}}>
            <div dangerouslySetInnerHTML={{ __html: marked(r.text)}} />
          </Panel>
      )
    });
  }

  renderDock(){
    return (
      <Dock position='right' isVisible={true} dimMode='none' size={.163}>
        {this.renderReconmendationPanels}
      </Dock>
    )
  }

  render(){
    if(this.state.noteBookStore.singleNote === undefined){
      return(null);
    } else {
      let content = this.state.noteBookStore.singleNote.content;
      return (
        <div className='container landingContainer span5 fill'>
          <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
          {this.renderDock()}
          {this.renderNoteLabel()}
          <Editor content={content} note={this.state.noteBookStore.singleNote} notebookId={this.state.notebookId} ws={this.state.ws}/>
        </div>
      )
    }
  }
}
export default NoteEditView;
