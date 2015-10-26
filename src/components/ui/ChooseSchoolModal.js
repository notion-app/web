import React from 'react';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Modal, Popover, Tooltip, OverlayTrigger, Thumbnail} from 'react-bootstrap';
import SchoolActions from 'actions/SchoolActions';
import SchoolStore from 'stores/SchoolStore';
import LoginManager from 'util/LoginManager';
import LoginActions from 'actions/loginActions';

var Typeahead = require('react-typeahead').Typeahead;

class ChooseSchoolModal  extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showModal:true,
      selectedOption: null,
      schoolStore: {
        schools:[]
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
    let chosenSchool = _.find(this.state.schoolStore.schools, (school) => {
      return school.name == this.state.selectedOption;
    });
    let authInfo = LoginManager.getAuthInfo();
    SchoolActions.setUserSchool(authInfo.fbData.id, authInfo.fbData.fb_auth_token, chosenSchool.id).then(()=>{
      console.log('DONE CHOOSING SCHOOL');
    });
    authInfo.fbData.school_id = chosenSchool.id;
    LoginActions.setAuthInfo(authInfo);
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  onChange(){
    this.setState({schoolStore:SchoolStore.getState()});
  }

  componentDidMount(){
    SchoolStore.listen(this.onChange);
    SchoolActions.fetchSchools();
  }

  getAllSchools() {
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

  render() {

    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Choose a school</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Type in the name of your school</h4>
            <Typeahead options={this.getAllSchools()} maxVisible={5} onOptionSelected={this.onOptionSelected}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ChooseSchoolModal;
