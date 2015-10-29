import React from 'react';
import {Input, Table, Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label} from 'react-bootstrap';
import _ from 'lodash';
import NotionNavBar from 'components/ui/notionNavBar';
import LoginManager from 'util/LoginManager';
import ChooseSchoolModal from 'components/ui/ChooseSchoolModal';

/* Stores */
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import NotebookStore from 'stores/NotebookStore';
import NotebookActions from 'actions/NotebookActions';
import SchoolStore from 'stores/SchoolStore';
import SchoolActions from 'actions/SchoolActions';


require('../css/editUserSettings.css');

class EditUserSettingsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: LoginManager.getAuthInfo(),
      noteBookStore: {
        notebooks:[]
      },
      schoolStore: {
        schools:[]
      },
      windowStore:{
        width:window.innerWidth,
        height:window.innerHeight
      },      
      detailDockVisable:false,
      chooseSchoolModalVisible:false
    }
    this.onNotebooksChange = this.onNotebooksChange.bind(this);
    this.onSchoolChange = this.onSchoolChange.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.renderNotebooks = this.renderNotebooks.bind(this);
    this.openSchoolModal = this.openSchoolModal.bind(this);
    this.getSchool = this.getSchool.bind(this);
  }

  onNotebooksChange(){
    let notebooks = NotebookStore.getState();
    this.setState({noteBookStore:notebooks});
  }

  onSchoolChange(){
    this.setState({schoolStore:SchoolStore.getState()});
  }

  componentDidMount(){
    WindowStore.listen(this.onWindowChange);
    window.addEventListener("resize", this.updateWindowDimensions);

    NotebookStore.listen(this.onNotebooksChange);
    NotebookActions.fetchNotebooks(this.state.user.fbData.id, this.state.user.fbData.fb_auth_token);

    SchoolStore.listen(this.onSchoolChange);
    SchoolActions.fetchSchools();
  }

  onWindowChange(){
    this.setState({windowStore:WindowStore.getState()});
  }

  updateWindowDimensions(e){
    WindowActions.setDimensions({width:window.innerWidth, height:window.innerHeight});
  }

  getSchool(id){
    console.log(id);
    let schools = this.state.schoolStore.schools;
    let schoolName = "(School Not Found)";

    let schoolViews = _.map(schools, (school) => {
      if (school.id == id){
        schoolName = school.name;
      }
    });
    return schoolName;
  }

  openSchoolModal(){
    console.log("Opening Modal");
    this.state.chooseSchoolModalVisible = true;
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
    let userSchoolId = this.getSchool(this.state.user.fbData.school_id);
    let panelHeader = `My Notebooks for ${userSchoolId}`;

    if(notebooks === undefined){
      return null;
    } else {
      return (
        <div>
          <Panel header="My School" bsStyle="primary">
            <h3>Purdue University</h3>
            <h5>West Lafayette, IN</h5>
            <Button bsStyle="primary" className="changeSchoolButton" onClick={this.openSchoolModal}>Change School</Button>
          </Panel>

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
    let shouldShowModal = this.state.chooseSchoolModalVisible;
    return (
      <div className='container landingContainer span5 fill'>
        {!shouldShowModal? null: <ChooseSchoolModal/>}
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
