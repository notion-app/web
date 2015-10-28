import React from 'react';
import { Input, Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Modal, Popover, Tooltip, OverlayTrigger, Thumbnail, DropdownButton, MenuItem} from 'react-bootstrap';
import CoursesActions from 'actions/CoursesActions';
import NotebookActions from 'actions/NotebookActions';
import CoursesStore from 'stores/CoursesStore';
import LoginManager from 'util/LoginManager';
import LoginActions from 'actions/loginActions';
import LoginStore from 'stores/loginStore';
import _ from 'lodash';

var Typeahead = require('react-typeahead').Typeahead;

class AddNotebookModal  extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      notebookName:'',
      showModal:false,
      selectedOption: null,
      selectedSection:"Sections",
      selectedSectionId:-1,
      authInfo: null,
      coursesStore: {
        courses:[]
      },
    }
    this.onChange = this.onChange.bind(this);
    this.close = this.close.bind(this);
    this.open =  this.open.bind(this);
    this.onOptionSelected = this.onOptionSelected.bind(this);
    this.renderSectionsDropDown = this.renderSectionsDropDown.bind(this);
    this.onSectionSelected = this.onSectionSelected.bind(this);
    this.onAuthChange = this.onAuthChange.bind(this);
    this.validateName = this.validateName.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

  validateName(){
    let length = this.state.notebookName.length;
    if(length >0) return 'success';
    else return 'error';
  }

  onNameChange(){
    this.setState({notebookName:this.refs.input.getValue()});
  }

  onOptionSelected(option){
    let course = _.find(this.state.coursesStore.courses, (course) => {
      return(_.includes(option, course.name))

    });
    CoursesActions.fetchSections(this.state.authInfo.userAuth.fbData.school_id,course.id);
    this.setState({selectedOption:option, selectedSectionId:-1, selectedSection:'Sections'});
  }

  onSectionSelected(obj,index) {
    let section = this.state.coursesStore.sections[index];
    this.setState({selectedSection:`CRN: ${section.crn}`, selectedSectionId:index});

  }


  close() {
    let section = this.state.coursesStore.sections[this.state.selectedSectionId];
    let user_id = this.state.authInfo.userAuth.fbData.id;
    let token = this.state.authInfo.userAuth.fbData.fb_auth_token;
    let notebook_id = section.notebook_id;
    let name = this.state.notebookName;

    NotebookActions.subscribeToNotebook(user_id,token,notebook_id, name);
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  onChange(){
    this.setState({coursesStore:CoursesStore.getState()});
  }

  onAuthChange(){
    let authInfo = LoginStore.getState();
    CoursesActions.fetchCourses(authInfo.userAuth.fbData.school_id );
    this.setState({authInfo:authInfo});
  }

  componentDidMount(){
    CoursesStore.listen(this.onChange);
    LoginStore.listen(this.onAuthChange);
    window.setTimeout(()=> {
      LoginActions.getAuthInfo();
    },1000)
  }

  getAllCourses() {

    if(this.state.coursesStore.courses.length == 0){
      return(null);
    }
    let courses = this.state.coursesStore.courses;

    var allCourses = [];
    let coursesViews = _.map(courses, (course) => {
      allCourses.push(`${course.number} - ${course.name}`);
    });

    return allCourses;
  }

  renderSectionsDropDown(){
    let menuItems = _.map(this.state.coursesStore.sections, (section,i) => {
      return (
        <MenuItem eventKey={i} key={i}>
          {`CRN: ${section.crn}`}
        </MenuItem>
      )
    });
    return (
      <div>
        <DropdownButton id='sectionDropdown' bsStyle='default' title={this.state.selectedSection} onSelect={this.onSectionSelected}>
          {menuItems}
        </DropdownButton>
        <br />
        <Input
          type="text"
          value={this.state.notebookName}
          label="Notebook name"
          bsStyle={this.validateName()}
          hasFeedback
          ref="input"
          groupClassName="group-class"
          labelClassName="label-class"
          onChange={this.onNameChange} />
      </div>
    )

  }

  render() {
    return (
      <div>
        <Thumbnail className="new-notebook-icon" href="#" alt="171x180" bsSize="xsmall" onClick={this.open} src="https://cdn0.iconfinder.com/data/icons/math-business-icon-set/93/1_1-512.png"/>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Notebook</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Typeahead options={this.getAllCourses()} maxVisible={5} onOptionSelected={this.onOptionSelected}/>
            <br />
            {this.state.selectedOption? this.renderSectionsDropDown():null}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Add Notebook</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddNotebookModal
