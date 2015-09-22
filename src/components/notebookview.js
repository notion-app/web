import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import DummyStore from 'stores/dummyStore';
import DummyActions from 'actions/dummyActions';
import NotionNavBar from 'components/ui/notionNavBar';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';

require('../css/landingpage.css');
require('../css/notebookview.css');
@connectToStores
class NotebookView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      router: props.router
    }
  }

  componentWillMount() {
      document.body.style.backgroundImage = null;
  }

  static getStores(props) {
    return [DummyStore];
  }

  static getPropsFromStores(props) {
    return DummyStore.getState();
  }

  render() {
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop'router={this.state.router}/>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              <Panel header={ <h3>CS 408 <Glyphicon glyph="star" /></h3> } bsStyle="primary">
                <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                <Label className="center" bsStyle="default">Last edited: 1:47 pm</Label>
              </Panel>
            </Col>
            <Col xs={12} md={4}>
              <Panel header={ <h3>ECON 491</h3> } bsStyle="primary">
                <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                <Label className="center" bsStyle="default">Last edited: 12:58 pm</Label>
              </Panel>
            </Col>
            <Col xs={12} md={4}>
              <Panel header={ <h3>PHYS 272</h3> } bsStyle="primary">
                <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                <Label className="center" bsStyle="default">Last edited: 2:19 pm</Label>
              </Panel>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              <Panel header={ <h3>CS 490</h3> } bsStyle="primary">
                <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                <Label className="center" bsStyle="default">Last edited: Yesterday, 1:48 pm</Label>
              </Panel>
            </Col>
            <Col xs={12} md={4}>
              <Panel header={ <h3>ECON 452</h3> } bsStyle="primary">
                <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                <Label className="center" bsStyle="default">Last edited: 09/18</Label>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

  onChange = evt => {
    this.setState({name: evt.target.value});
    DummyActions.updateName(evt.target.value);
  }
}

export default NotebookView;
