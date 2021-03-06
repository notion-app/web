import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import NotebookStore from 'stores/NotebookStore';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import NotebookActions from 'actions/NotebookActions';
import NotionNavBar from 'components/ui/notionNavBar';
import AddNotebookModal from 'components/ui/addNewNotebookModal';
import ChooseSchoolModal from 'components/ui/ChooseSchoolModal';
import { Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label, Modal } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import Dock from 'react-dock';
import LoginManager from 'util/LoginManager';
import marked from 'marked';

require('../css/landingpage.css');
require('../css/notebookview.css');
@connectToStores
class NotebookView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: LoginManager.getAuthInfo(),
      noteBookStore: {
        notebooks:[],
        joinedNotes:[]
      },
      detailDockVisable:false,
      currentSelectedNotebook:null,
      windowStore:{
        width:window.innerWidth,
        height:window.innerHeight
      }
    }
    this.onChange = this.onChange.bind(this);
    this.onWindowChange = this.onWindowChange.bind(this);
    this.renderNotebooks = this.renderNotebooks.bind(this);
    this.handleVisibleChanged = this.handleVisibleChanged.bind(this);
    this.onNotebookClick = this.onNotebookClick.bind(this);
    this.onOpenNotebook = this.onOpenNotebook.bind(this);
    this.onNotebookDeleteClick = this.onNotebookDeleteClick.bind(this);
    this.onManageClick = this.onManageClick.bind(this);
  }

  componentWillMount() {
      document.body.style.backgroundImage = null;
  }

  componentDidMount(){
    let authInfo = LoginManager.getAuthInfo()
    NotebookStore.listen(this.onChange)
    WindowStore.listen(this.onWindowChange);
    window.addEventListener("resize", this.updateWindowDimensions);
    NotebookActions.fetchNotebooks(authInfo.fbData.id, this.state.user.fbData.fb_auth_token);
  }

  shouldComponentUpdate(nextProps,nextState){;
    // HACK
    if( (this.state.noteBookStore.notebooks.length !== nextState.noteBookStore.notebooks.length) || (this.state.noteBookStore.notebooks.length === nextState.noteBookStore.notebooks.length)  ){
      return true
    }

    else if(this.state.detailDockVisable != nextState.detailDockVisable){
      return true;
    }

    else if(this.state.windowStore.width != nextState.windowStore.width){
      return true;

    }
    return false;
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

  static getStores(props) {
    return [NotebookStore, WindowStore];
  }

  static getPropsFromStores(props) {
    return NotebookStore.getState();
  }

  handleVisibleChanged(isVisible){
  this.setState({ detailDockVisable:isVisible });
}

  onNotebookClick(index){
    if(this.state.detailDockVisable){
      this.setState({detailDockVisable:false});
    }
    let notebook = this.state.noteBookStore.notebooks[index-1];
    NotebookActions.getJoinedNotes(notebook.notebook_id, this.state.user.fbData.fb_auth_token);
    this.setState({currentSelectedNotebook:index-1, detailDockVisable:true});
  }

  onNoteClick(index){
    let notebook = this.state.noteBookStore.notebooks[this.state.currentSelectedNotebook];
    let note = this.state.noteBookStore.joinedNotes[index].notes[0];
    location = `/notebooks/${notebook.notebook_id}/note/${note.id}/edit/editMode`;
  }

  onManageClick(){
    let notebook = this.state.noteBookStore.notebooks[this.state.currentSelectedNotebook];
    location = `/notebooks/${notebook.notebook_id}/manage`;
  }

  onNotebookDeleteClick(index){
    let notebook = this.state.noteBookStore.notebooks[index-1];
    let  user_id = this.state.user.fbData.id;
    let token = this.state.user.fbData.fb_auth_token;
    NotebookActions.unsubscribeToNotebook(user_id, token, notebook.notebook_id);

  }


  renderNotes(notebook){
    let notes = this.state.noteBookStore.joinedNotes;

      let chunks = _.chunk(notes,3);
      let first = chunks[0];
      let notebookChildren = _.map(first, (note,index)=>{
      let content = _.trunc(note.notes[0].content,100);
      let timeAgo = moment(note.notes[0].updated_at).fromNow();

        return (
          <Col xs={12} md={4} className='notecol' onClick={this.onNoteClick.bind(this,index)} keys={index}>
            <Panel header={<h3>{note.notes[0].title}</h3>} bsStyle='primary'>
              <div dangerouslySetInnerHTML={{ __html: marked(content)}}>
              </div>
              <Label className="center" bsStyle="default">{`Last Edited: ${timeAgo}`}</Label>
            </Panel>
          </Col>
        )
      });
      return notebookChildren;
    }

  onOpenNotebook(){
    let notebook = this.state.noteBookStore.notebooks[this.state.currentSelectedNotebook];
    location = `/notebooks/${notebook.notebook_id}`;
  }

  renderDetailDock(){
    if(this.state.currentSelectedNotebook == null){
      return(null);
    }
    let notebook = this.state.noteBookStore.notebooks[this.state.currentSelectedNotebook];
    this.renderNotes(notebook)
    return (
      <Dock position='bottom' isVisible={this.state.detailDockVisable} onVisibleChanged={this.handleVisibleChanged} flud={true} size={.50}>
        <div className='detailDock'>
          <Grid>
            <Col>
              <Panel className='deatilPanel' header={ <h3> {notebook.name}  <Glyphicon glyph="star" /></h3> } bsStyle="primary">
                <Row className='center'>
                  <Thumbnail className="notebook-icon notebookimg img img-responsive" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                </Row>
                <Label className="center" bsStyle="default">{notebook.lastEdit}</Label>
                  <ButtonToolbar className='detailToolbar'>
                      <Button className='openButton' onClick={this.onOpenNotebook}>
                        Open
                      </Button>
                      <Button className='manageButton' onClick={this.onManageClick}>
                        Manage
                      </Button>
                  </ButtonToolbar>
              </Panel>
            </Col>
          </Grid>
          <Grid className='notesGrid'>
            <Row className='show-grid'>
              {this.renderNotes(notebook)}
            </Row>
          </Grid>
        </div>
      </Dock>
    );
}


  renderNotebooks() {
    let emptyNotebookHolder = {
      name: '__add_new_notebook__',
    };

    let notebooks = this.state.noteBookStore.notebooks.concat(emptyNotebookHolder);
    let chunks = this.state.windowStore.width <= 991? _.chunk(notebooks,2): _.chunk(notebooks,3);
    let childKey = 0;
    let rowKey = 0;
    let notebookViews = _.map(chunks, (notebooks,index) =>{
      let notebookChildren = _.map(notebooks, (notebook,notebookIndex)=>{
        childKey = childKey+1;
        if (notebook.name == '__add_new_notebook__'){
          return (
            <Col xs={12} md={4} key={childKey} className='notebookcol'>
              <Panel header={ <h3> Add New Notebook </h3> } bsStyle="default" className='addNewNotebookPanel'>
              <AddNotebookModal />
              </Panel>
            </Col>
          );
        }
        else {
          return (
            <Col xs={12} md={4} key={childKey} className='notebookcol'>
              <Panel header={ <h3> {notebook.name} <Glyphicon className="pull-right removeNotebookIcon" glyph="remove" onClick={this.onNotebookDeleteClick.bind(this,childKey)}/> </h3> } bsStyle="primary">
                <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png" onClick={this.onNotebookClick.bind(this,childKey)}/>
                <Label className="center" bsStyle="default">{notebook.lastEdit}</Label>
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
    let notebookViews = this.renderNotebooks();
    let hasSchoolId = this.state.user.fbData.school_id !== "";
    return (
      <div className='container landingContainer span5 fill'>
        {hasSchoolId? null: <ChooseSchoolModal/>}
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
        {this.renderDetailDock()}
        <Grid>
          {notebookViews}
        </Grid>
      </div>
    );
  }

}

export default NotebookView;
