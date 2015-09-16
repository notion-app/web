import React from 'react';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row} from 'react-bootstrap';

class NotionNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'name':this.props.name,
      'style':this.props.style
    }
  }

  render() {
    let isFixedTop = this.state.style == 'fixedTop' ? true:false;
    return (
      <Navbar brand='Notion' fixedTop={isFixedTop}/>
    )
  }
}

export default NotionNavBar;
