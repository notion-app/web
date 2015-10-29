import React from 'react';
import {Input, Table, Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';
import _ from 'lodash';
import NotionNavBar from 'components/ui/notionNavBar';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import LoginManager from 'util/LoginManager';
import NotebookStore from 'stores/NotebookStore';
import NotebookActions from 'actions/NotebookActions';

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
    this.onNotebooksChange = this.onNotebooksChange.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.renderNotebooks = this.renderNotebooks.bind(this);
  }

  onNotebooksChange(){
    let notebooks = NotebookStore.getState();
    this.setState({noteBookStore:notebooks});
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

  renderNotebooks() {
    let notebooks = this.state.noteBookStore.notebooks;
    if (notebooks == null){
      return null;
    } else {
      let notebookChildren = _.map(notebooks, (n,notebookIndex)=>{
        return (
          <tr>
            <td>{n.course.name}</td>
            <td>{n.course.number}</td>
            <td>{n.section.crn}</td>
            <td>{n.section.professor}</td>
            <td>{`${n.section.semester} ${n.section.year}`}</td>
            <td>{n.section.time}</td>
          </tr>
        );
      });
      return notebookChildren;
    }
  }

  renderTableData(){
    let notebooks = this.state.noteBookStore.notebooks;    
    let userSchoolId = this.state.user.fbData.school_id;
    let panelHeader = `Notebooks for ${userSchoolId}`;

    if(notebooks === undefined){
      return null;
    } else {
      return (
        <div>
          <Panel header={panelHeader}>
            <Table striped bordered condensed hover responsive>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Course Number</th>
                <th>CRN</th>
                <th>Professor</th>
                <th>Semester</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {this.renderNotebooks()}
            </tbody>
          </Table>
        </Panel>
      </div>
      )
    }
  }

  render() {
    return (
      <div className='container landingContainer span5 fill'>
        <h2>Hello, {this.state.user.fbData.name}! </h2>
        <h4>Manage your profile here...</h4>
        <br/>
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
          {this.renderTableData()}
      </div>
    );
  }

}

export default EditUserSettingsView;
