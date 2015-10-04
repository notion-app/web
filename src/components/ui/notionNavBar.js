import React from 'react';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row} from 'react-bootstrap';
import LoginManager from 'util/LoginManager';
import LoginStore from 'stores/loginStore';
import LoginActions from 'actions/loginActions';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import connectToStores from 'alt/utils/connectToStores';
import Dock from 'react-dock';
import _ from 'lodash';

require('../../../bower_components/bootstrap/dist/css/bootstrap.css');
require('../../css/navbar.css');
@connectToStores
class NotionNavBar extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      'isVisible':false,
      height:props.height,
      width:props.width
    }
    this.handleOnLogoutClick = this.handleOnLogoutClick.bind(this);
    this.handleOnLogoutClick = this.handleOnLogoutClick.bind(this);
    this.renderNavLinks = this.renderNavLinks.bind(this);
    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.handleVisibleChanged = this.handleVisibleChanged.bind(this);
  }

  static getStores(props) {
    return [LoginStore];
  }

  static getPropsFromStores(props) {
    return LoginStore.getState();
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }


  handleVisibleChanged = isVisible => {
  this.setState({ isVisible });
}



  handleOnLogoutClick() {
    LoginManager.logout();
    window.location.replace('/');
  }

  renderNavLinks() {
    return (
      <NavItem eventKey={1} onClick={this.handleOnLogoutClick}>Logout</NavItem>
    );
  }

  renderSidebarContent() {
    let authInfo = LoginManager.getAuthInfo()
    return (
      <div>
          <span className="glyphicon glyphicon-menu-hamburger hamburger-icon" onClick={this.openSidebar}/>
          <Dock position='left' fluid={true} size={.25} isVisible={this.state.isVisible} onVisibleChanged={this.handleVisibleChanged} >
          <div className="row profile">
         		<div className="col-md-3">
         			<div className="profile-sidebar">
                <span className="glyphicon glyphicon-remove close-icon" onClick={this.closeSidebar}></span>
         				<div className="profile-userpic">
                  <img src={authInfo.fbData.profileImage} className="img-responsive" alt=""/>

         				</div>

         				<div className="profile-usertitle">
         					<div className="profile-usertitle-name">
         						{authInfo.fbData.name}
         					</div>
         				</div>


         				<div className="profile-usermenu">
         					<ul className="nav">
         						<li className="active">
         							<a href="#">
         							<i className="glyphicon glyphicon-home"></i>
         							Overview </a>
         						</li>
         						<li>
         							<a href="#">
         							<i className="glyphicon glyphicon-user"></i>
         							Account Settings </a>
         						</li>
         						<li>
         							<a href="#" target="_blank">
         							<i className="glyphicon glyphicon-ok"></i>
         							Tasks </a>
         						</li>
         						<li>
         							<a href="#">
         							<i className="glyphicon glyphicon-flag"></i>
         							Help </a>
         						</li>
         					</ul>
         				</div>

         			</div>
         		</div>
          </div>
        </Dock>
    </div>
    )
  }

  openSidebar(){
    if(this.state.isVisible == false){
        this.setState({isVisible:true});
    }
  }

  closeSidebar(){
    if(this.state.isVisible){
        this.setState({isVisible:false});
    }
  }

  render() {
    let check = LoginManager.getAuthInfo();
    let notLoggedIn = (_.isNull(this.props.userAuth) && (_.isNull(check))) || (!_.isNull(check) && !check.loggedIn);
    return (
      <Navbar brand='Notion' fixedTop={true} >
        <Nav right eventKey={0}> {/* This is the eventKey referenced */}
          <NavItem >
            {notLoggedIn? null:this.renderNavLinks()}
          </NavItem>
          {window.innerWidth <= 765?
            <NavItem onClick={this.openSidebar} eventKey={2}>
              Menu
            </NavItem>
            : null
          }
        </Nav>
        <Nav left eventKey={1} className='pull-left'>
            {notLoggedIn? null:this.renderSidebarContent()}
        </Nav>
      </Navbar>
    )
  }
}

export default NotionNavBar;
