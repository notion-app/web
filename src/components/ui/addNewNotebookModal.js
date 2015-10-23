import React from 'react';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Modal, Popover, Tooltip, OverlayTrigger, Thumbnail, DropdownButton, MenuItem} from 'react-bootstrap';
import CoursesActions from 'actions/CoursesActions';
import NotebookActions from 'actions/NotebookActions';
import CoursesStore from 'stores/CoursesStore';
import LoginManager from 'util/LoginManager';
import _ from 'lodash';

var Typeahead = require('react-typeahead').Typeahead;

class AddNotebookModal  extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showModal:false,
      selectedOption: null,
      selectedSection:"Sections",
      selectedSectionId:-1,
      authInfo: LoginManager.getAuthInfo(),
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
  }

  onOptionSelected(option){
    let course = _.find(this.state.coursesStore.courses, (course) => {
      return(_.includes(option, course.name))

    });
    CoursesActions.fetchSections(this.state.authInfo.fbData.school_id,course.id);
    this.setState({selectedOption:option, selectedSectionId:-1, selectedSection:'Sections'});
  }

  onSectionSelected(obj,index) {
    let section = this.state.coursesStore.sections[index];
    this.setState({selectedSection:`CRN: ${section.crn}`, selectedSectionId:index});

  }

  close() {
    let section = this.state.coursesStore.sections[this.state.selectedSectionId];
    let user_id = this.state.authInfo.fbData.id;
    let token = this.state.authInfo.fbData.fb_auth_token;
    let notebook_id = section.notebook_id;

    NotebookActions.subscribeToNotebook(user_id,token,notebook_id);
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  onChange(){
    this.setState({coursesStore:CoursesStore.getState()});
  }

  componentDidMount(){
    CoursesStore.listen(this.onChange);
    CoursesActions.fetchCourses(this.state.authInfo.fbData.school_id );
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
      <DropdownButton id='sectionDropdown' bsStyle='default' title={this.state.selectedSection} onSelect={this.onSectionSelected}>
        {menuItems}
      </DropdownButton>
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
            {this.state.selectedOption? this.renderSectionsDropDown():null}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddNotebookModal
