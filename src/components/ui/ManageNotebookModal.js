import React from 'react';
import { Input, Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Modal, Popover, Tooltip, OverlayTrigger, Thumbnail} from 'react-bootstrap';
import NotebookActions from 'actions/NotebookActions';
import NotebookStore from 'stores/NotebookStore';

class ManageNotebookModal extends React.Component{
  constructor(props){
    console.log('yyy')
    super(props);
    this.state  = {
      showModal:false,
      listener:null,
      notebookName:''
    };
    this.onOKClick = this.onOKClick.bind(this);
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

  componentDidMount(){
    NotebookActions.turnOnManageModal();
  }

  onOKClick() {
    NotebookActions.turnOffManageModal();
    this.setState({showModal:false});
  }

  render(){
    console.log('render mod')
    console.log(this.state.showModal);
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.onOKClick}>
          <Modal.Header closeButton>
            <Modal.Title>Manage a Notebook</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onOKClick}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ManageNotebookModal;
