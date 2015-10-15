import React from 'react';
import FacebookLogin from 'components/ui/FacebookLogin';
import connectToStores from 'alt/utils/connectToStores';
import LoginStore from 'stores/loginStore';
import LoginActions from 'actions/loginActions';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row} from 'react-bootstrap';
import NotionNavBar from 'components/ui/notionNavBar';
import LoginManager from 'util/LoginManager';
import ExampleComponent from 'components/example';
import NotebookView from 'components/notebookview';
import _ from 'lodash';

require('../css/landingpage.css');
require('../../bower_components/bootstrap/dist/css/bootstrap.css');


@connectToStores
class LandingPageComponent extends React.Component {
  constructor(props, context) {
    super(props,context);
    this.state = {
      name: props.name,
      userAuth: props.userAuth
    }
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    document.body.style.backgroundImage = "url('http://res.cloudinary.com/dwigxrles/image/upload/v1442514526/banner-bg_wfek8a.jpg')";
  }
  componentWillUnmount (){
    document.body.style.backgroundImage = null;
  }

  static getStores(props) {
    return [LoginStore];
  }

  static getPropsFromStores(props) {
    return LoginStore.getState();
  }

  handleFacebookLogin(result) {
    LoginActions.login(result);
  }

  renderRegistration() {
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop' router={this.context.router}/>
        <Grid>
          <Row>
            <div className='class="col-md-2 col-centered text-center notionText'>
              Notion
            </div>
            <div className='class="col-md-2 text-center notionSubText'>
              a collaborative note taking service
            </div>
            <hr className='divider'></hr>
          </Row>
          <Row>
            <div className='text-center'>
              <FacebookLogin
                appId="884810131605384"
                class="facebook-login"
                scope="public_profile, email,"
                loginHandler={ this.handleFacebookLogin } />
            </div>
          </Row>
        </Grid>
      </div>
    )
  }

  render() {
    let check = LoginManager.getAuthInfo();
    if( _.isNull(this.props.userAuth) && _.isNull(check)) {
      return this.renderRegistration();
    } else if(check.loggedIn == false) {
      return this.renderRegistration();
    } else {
      window.location.replace('/notebooks');
      return(null);
    }
  }

}


export default LandingPageComponent;
