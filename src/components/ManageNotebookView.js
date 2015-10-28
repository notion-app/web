import React from 'react';
import {Input, Table, Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';
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
      },
      notebookName:''
    }
    this.onNotebooksChange = this.onNotebooksChange.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.validateName = this.validateName.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onUpdateNameClick = this.onUpdateNameClick.bind(this);
    this.generateButton = this.generateButton.bind(this);
  }

  onUpdateNameClick(notebook){
    NotebookActions.updateNotebook(this.state.user.fbData.id, this.state.user.fbData.fb_auth_token, notebook.notebook_id, this.state.notebookName);
  }

  validateName(){
    let length = this.state.notebookName.length;
    if(length >0) return 'success';
    else return 'error';
  }

  onNameChange(){
    this.setState({notebookName:this.refs.input.getValue()});
  }

  onNotebooksChange(){
    let notebooks = NotebookStore.getState();
    let n = _.find(notebooks.notebooks, {notebook_id: this.state.notebook_id});

    this.setState({noteBookStore:notebooks, notebookName: n.name});
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

  generateButton(notebook){
    if(this.state.notebookName == notebook.name){
      return (
        <Button className="pull-right" bsStyle="primary" onClick={this.onUpdateNameClick.bind(this,notebook)} disabled>Update Name</Button>
      )
    } else {
      return (
        <Button className="pull-right" bsStyle="primary" onClick={this.onUpdateNameClick.bind(this,notebook)} >Update Name</Button>
      )
    }
  }

  renderTableData(){
    let n = _.find(this.state.noteBookStore.notebooks, {notebook_id: this.state.notebook_id});
    if(n === undefined){
      return null;
    } else {
      return (
        <div>
          <Panel header="Course">
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
              <tr>
                <td>{n.course.name}</td>
                <td>{n.course.number}</td>
                <td>{n.section.crn}</td>
                <td>{n.section.professor}</td>
                <td>{`${n.section.semester} ${n.section.year}`}</td>
                <td>{n.section.time}</td>
              </tr>
            </tbody>
          </Table>
        </Panel>
        <Panel header="Notebook Name">
          <Input
            type="text"
            value={this.state.notebookName}
            label="Change Notebook Name"
            bsStyle={this.validateName()}
            hasFeedback
            ref="input"
            groupClassName="group-class"
            labelClassName="label-class"
            onChange={this.onNameChange} />
          {this.generateButton(n)}
        </Panel>
      </div>
      )
    }
  }

  render(){
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
        {this.renderTableData()}
      </div>
    )
  }
}

export default ManageNotebookView;
