import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import DummyStore from 'stores/dummyStore';
import DummyActions from 'actions/dummyActions';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row} from 'react-bootstrap';
import NotionNavBar from 'components/ui/notionNavBar';

require('../css/stylesheet.css');
require('../../bower_components/bootstrap/dist/css/bootstrap.css');


@connectToStores
class LandingPageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name
    }
  }

  static getStores(props) {
    return [DummyStore];
  }

  static getPropsFromStores(props) {
    return DummyStore.getState();
  }

  handleOnSignupClick(event) {
    console.log(event);
    console.log('click');
  }

  render() {
    return (
      <div className='container'>
        <NotionNavBar name='Notion' style='fixedTop'/>
        <Grid>
          <Row>
            <Jumbotron>
              <h1>This looks cool</h1>
              <p>And This says some stuff</p>
            </Jumbotron>
          </Row>
          <Row>
            <Button onClick={this.handleOnSignupClick}>Sign up!</Button>
          </Row>
        </Grid>
      </div>
    );
  }

}

export default LandingPageComponent;
