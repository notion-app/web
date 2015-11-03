import React from 'react';
import {Input, Table, Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label} from 'react-bootstrap';
import _ from 'lodash';
import NotionNavBar from 'components/ui/notionNavBar';
import LoginManager from 'util/LoginManager';
import LoginActions from 'actions/loginActions';
import ChooseSchoolModal from 'components/ui/ChooseSchoolModal';

/* Stores */
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import NotebookStore from 'stores/NotebookStore';
import NotebookActions from 'actions/NotebookActions';
import SchoolStore from 'stores/SchoolStore';
import SchoolActions from 'actions/SchoolActions';

var Typeahead = require('react-typeahead').Typeahead;
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
      chooseSchoolTypeaheadVisible:false,
      schoolHasBeenSelected:false,
      selectedOption: null
    }

    this.onNotebooksChange = this.onNotebooksChange.bind(this);
    this.onSchoolChange = this.onSchoolChange.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.renderNotebooks = this.renderNotebooks.bind(this);
    this.openSchoolModal = this.openSchoolModal.bind(this);
    this.getSchoolByID = this.getSchoolByID.bind(this);
    this.onSchoolSelected = this.onSchoolSelected.bind(this);
    this.getAllSchoolNames = this.getAllSchoolNames.bind(this);
    this.getChangeSchoolButtonText = this.getChangeSchoolButtonText.bind(this);
    this.getChangeSchoolButtonStyle = this.getChangeSchoolButtonStyle.bind(this);
    this.getChangeSchoolTypeaheadClass = this.getChangeSchoolTypeaheadClass.bind(this);
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

  openSchoolModal(){
    if (this.state.chooseSchoolTypeaheadVisible){
      // User wants to save new school:
      if (this.state.schoolHasBeenSelected){
        /*

        *** Enable if we actually want to let users change their school later on ***

        let chosenSchool = _.find(this.state.schoolStore.schools, (school) => {
          return school.name == this.state.selectedOption;
        });
        let authInfo = LoginManager.getAuthInfo();
        SchoolActions.setUserSchool(authInfo.fbData.id, authInfo.fbData.fb_auth_token, chosenSchool.id).then(()=>{
          console.log('DONE CHOOSING SCHOOL');
        });
        authInfo.fbData.school_id = chosenSchool.id;
        LoginActions.setAuthInfo(authInfo);*/
        this.setState({chooseSchoolTypeaheadVisible:false, schoolHasBeenSelected:false})
      }
      // User clicked 'cancel':
      else {        
        this.setState({chooseSchoolTypeaheadVisible:false});
      }
    }
    // User wants to search for school:
    else {
      this.setState({chooseSchoolTypeaheadVisible:true});
    }
  }

  updateWindowDimensions(e){
    WindowActions.setDimensions({width:window.innerWidth, height:window.innerHeight});
  }

  onSchoolSelected(option){
    this.setState({schoolHasBeenSelected:true, selectedOption:option});
  }

  getChangeSchoolButtonStyle(){
    if (this.state.chooseSchoolTypeaheadVisible){
      return this.state.schoolHasBeenSelected ? "success" : "danger";
    }
    else {
      return "primary";
    }
  }

  getChangeSchoolButtonText(){
    if (this.state.chooseSchoolTypeaheadVisible){
      return this.state.schoolHasBeenSelected ? "Submit Change" : "Cancel";
    }
    else {
      return "Change School";
    }
  }

  getChangeSchoolTypeaheadClass(){
    if (this.state.chooseSchoolTypeaheadVisible){
      return"visibleSchoolSelector";
    }
    else {
      return "hiddenSchoolSelector";
    }
  }

  getAllSchoolNames() {
    if(this.state.schoolStore.schools.length == 0){
      return(null);
    }

    let schools = this.state.schoolStore.schools;

    var allSchools = [];
    let schoolViews = _.map(schools, (school) => {
      allSchools.push(school.name);
    });

    return allSchools;
  }

  getSchoolByID(id){
    let schools = this.state.schoolStore.schools;
    let schoolToReturn = null;

    let schoolViews = _.map(schools, (school) => {
      if (school.id == id){
        schoolToReturn = school;
      }
    });

    return schoolToReturn;
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
    let userSchool = this.getSchoolByID(this.state.user.fbData.school_id);
    let userSchoolName = "(School Not Found)";
    let userSchoolLocation = "";
    if (userSchool != null){
      userSchoolName = userSchool.name;
      userSchoolLocation = userSchool.location;
    }

    let panelHeader = `My Notebooks for ${userSchoolName}`;

    if(notebooks === undefined){
      return null;
    } else {
      return (
        <div>
          <Panel header="My School" bsStyle="primary">
            <h3>{userSchoolName}</h3>
            <h5>{userSchoolLocation}</h5>
            <Button bsStyle={this.getChangeSchoolButtonStyle()} className="changeSchoolButton" onClick={this.openSchoolModal}>{this.getChangeSchoolButtonText()}</Button>
            <Typeahead className={this.getChangeSchoolTypeaheadClass()} options={this.getAllSchoolNames()} maxVisible={5} onOptionSelected={this.onSchoolSelected}/>
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
