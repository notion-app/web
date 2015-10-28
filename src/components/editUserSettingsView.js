import React from 'react';
import { Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label, Modal } from 'react-bootstrap';
import CoursesActions from 'actions/CoursesActions';
import NotebookActions from 'actions/NotebookActions';
import CoursesStore from 'stores/CoursesStore';
import NotebookStore from 'stores/NotebookStore';
import LoginManager from 'util/LoginManager';
import LoginActions from 'actions/loginActions';
import LoginStore from 'stores/loginStore';
import connectToStores from 'alt/utils/connectToStores';
import _ from 'lodash';

@connectToStores
class EditUserSettingsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: LoginManager.getAuthInfo(),
      noteBookStore: {
        notebooks:[]
      },
      detailDockVisable:false,
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

  render() {
    let notebookViews = this.renderNotebooks();
    let hasSchoolId = this.state.user.fbData.school_id !== "";
    return (
      <div className='container landingContainer span5 fill'>
        {hasSchoolId? null: <ChooseSchoolModal/>}
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
        HELLO WORLD
        <Grid>
          HELLO WORLD
        </Grid>
      </div>
    );
  }

}

export default EditUserSettingsView;
