import React from 'react';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Modal, Popover, Tooltip, OverlayTrigger, Thumbnail} from 'react-bootstrap';
import CoursesActions from 'actions/CoursesActions';


var Typeahead = require('react-typeahead').Typeahead;

const AddNotebookModal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  getAllCourses() {
    return ['CS 180',        
            'CS 182',
            'CS 240',
            'CS 250',
            'CS 251',
            'CS 252',
            'CS 308',
            'CS 352',
            'CS 352',
            'CS 348',
            'CS 408',
            'CS 490',
            'ECON 251',
            'ECON 252',
            'ECON 451',
            'ECON 471',
            'ECON 490',
            'MA 251',
            'MA 252',
            'MA 265'];
    /*       
    CoursesActions.fetchCourses();

    var allCourses = [];
    let coursesViews = _.map(courses, (course) => {
      allCourses.push(course.title);
    });

    return allCourses; */
  },

  render() {

    let popover = <Popover title="popover">very popover. such engagement</Popover>;
    let tooltip = <Tooltip>wow.</Tooltip>;

    return (
      <div>
        <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" onClick={this.open} src="https://cdn0.iconfinder.com/data/icons/math-business-icon-set/93/1_1-512.png"/>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Notebook</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Typeahead options={this.getAllCourses()} maxVisible={5} />
            <Button className="addNotebookButton" bsStyle="success" onClick={this.close}>Add Notebook</Button>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

export default AddNotebookModal
