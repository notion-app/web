import React from 'react';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row} from 'react-bootstrap';
import LoginManager from 'util/LoginManager';
import LoginStore from 'stores/loginStore';
import LoginActions from 'actions/loginActions';
import connectToStores from 'alt/utils/connectToStores';
import _ from 'lodash';


@connectToStores
class NotionNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'name':this.props.name,
      'style':this.props.style,
      'router':this.props.router
    }
    this.handleOnLogoutClick = this.handleOnLogoutClick.bind(this);
  }

  static getStores(props) {
    return [LoginStore];
  }

  static getPropsFromStores(props) {
    return LoginStore.getState();
  }

  handleOnLogoutClick() {
    LoginManager.logout();
    window.location.reload();
  }

  renderNavLinks() {
    return (
      <NavItem eventKey={1} onClick={this.handleOnLogoutClick}>Logout</NavItem>
    );
  }


  render() {
    console.log('render nav', this.props);
    let isFixedTop = this.state.style == 'fixedTop' ? true:false;
    let notLoggedIn = _.isNull(this.props.userAuth);
    return (
      <Navbar brand='Notion' fixedTop={isFixedTop}>
        <Nav right eventKey={0}> {/* This is the eventKey referenced */}
          {notLoggedIn? null:this.renderNavLinks()}
        </Nav>
      </Navbar>
    )
  }
}

export default NotionNavBar;
