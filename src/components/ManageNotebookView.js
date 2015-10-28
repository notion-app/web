import React from 'react';
import {Table, Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';
import _ from 'lodash';
import NotionNavBar from 'components/ui/notionNavBar';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import LoginManager from 'util/LoginManager';
import NotebookStore from 'stores/NotebookStore';
import NotebookActions from 'actions/NotebookActions';

class ManageNotebookView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notebook_id: props.params.notebookId,
      user:LoginManager.getAuthInfo(),
      windowStore:{
        width:window.innerWidth,
        height:window.innerHeight
      },
      noteBookStore: {
        notebooks:[]
      }
    }
    this.onNotebooksChange = this.onNotebooksChange.bind(this);
  }

  onNotebooksChange(){
    this.setState({noteBookStore:NotebookStore.getState()});
  }

  componentDidMount(){
    WindowStore.listen(this.onWindowChange);
    window.addEventListener("resize", this.updateWindowDimensions);
    NotebookStore.listen(this.onNotebooksChange);
    NotebookActions.fetchNotebooks(this.state.user.fbData.id, this.state.user.fbData.fb_auth_token);
  }

  onWindowChange(){
    this.setState({windowStore:WindowStore.getState()});
  }

  updateWindowDimensions(e){
    WindowActions.setDimensions({width:window.innerWidth, height:window.innerHeight});
  }

  render(){
    console.log(this.state);
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
          <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}

export default ManageNotebookView;
