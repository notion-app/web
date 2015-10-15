import React from 'react';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Modal, Popover, Tooltip, OverlayTrigger, Thumbnail} from 'react-bootstrap';
import CoursesActions from 'actions/CoursesActions';
import NotebookActions from 'actions/NotebookActions';
import CoursesStore from 'stores/CoursesStore';

var Typeahead = require('react-typeahead').Typeahead;

class AddNotebookModal  extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showModal:false,
      selectedOption: null,
      coursesStore: {
        courses:[]
      },
    }    
    this.onChange = this.onChange.bind(this);
    this.close = this.close.bind(this);
    this.open =  this.open.bind(this);
    this.onOptionSelected = this.onOptionSelected.bind(this);
  }

  onOptionSelected(option){
    this.setState({selectedOption:option});
  }

  close() {
    let newNoteBook = {
      title: this.state.selectedOption,
      lastEdit: 'Last edited: 1:47 pm',
      notes:[]
    }
    NotebookActions.addNotebook(newNoteBook);
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
    CoursesActions.fetchCourses();
  }

  getAllCourses() {
    
    if(this.state.coursesStore.courses.length == 0){
      return(null);
    }

    let courses = this.state.coursesStore.courses;

    var allCourses = [];
    let coursesViews = _.map(courses, (course) => {
      allCourses.push(course.title);
    });

    return allCourses; 
  }

  render() {

    let popover = <Popover title="popover">very popover. such engagement</Popover>;
    let tooltip = <Tooltip>wow.</Tooltip>;

    return (
      <div>
        <Thumbnail className="new-notebook-icon" href="#" alt="171x180" bsSize="xsmall" onClick={this.open} src="https://cdn0.iconfinder.com/data/icons/math-business-icon-set/93/1_1-512.png"/>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Notebook</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Typeahead options={this.getAllCourses()} maxVisible={5} onOptionSelected={this.onOptionSelected}/>
            <Button className="addNotebookButton" bsStyle="success" onClick={this.close}>Add Notebook</Button>
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
