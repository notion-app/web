import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import NotebookStore from 'stores/NotebookStore';
import NotebookActions from 'actions/NotebookActions';
import NotionNavBar from 'components/ui/notionNavBar';
import { Button, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';
import _ from 'lodash';
import Dock from 'react-dock';

require('../css/landingpage.css');
require('../css/notebookview.css');
@connectToStores
class NotebookView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      notebooks: [],
      detailDockVisable:false,
      currentSelectedNotebook:null
    }
    this.onChange = this.onChange.bind(this);
    this.renderNotebooks = this.renderNotebooks.bind(this);
    this.handleVisibleChanged = this.handleVisibleChanged.bind(this);
    this.onNotebookClick = this.onNotebookClick.bind(this);
  }

  componentWillMount() {
      document.body.style.backgroundImage = null;
  }

  componentDidMount(){
    NotebookStore.listen(this.onChange);
    NotebookActions.fetchNotebooks();
  }

  onChange(){
    this.setState(NotebookStore.getState());
  }


  static getStores(props) {
    return [NotebookStore];
  }

  static getPropsFromStores(props) {
    return NotebookStore.getState();
  }

  handleVisibleChanged(isVisible){
  this.setState({ detailDockVisable:isVisible });
}

  onNotebookClick(index){
    //console.log('clicked', this.state.notebooks[ind-1tat]);
    if(this.state.detailDockVisable){
      this.setState({detailDockVisable:false});
    }
    this.setState({currentSelectedNotebook:index-1, detailDockVisable:true});
  }

  renderDetailDock(){
    if(this.state.currentSelectedNotebook == null){
      return(null);
    }
    let notebook = this.state.notebooks[this.state.currentSelectedNotebook];
    return (
      <Dock position='bottom' isVisible={this.state.detailDockVisable} onVisibleChanged={this.handleVisibleChanged}>
        <h1>{notebook.title}</h1>
      </Dock>
    );
}


  renderNotebooks() {
    if(this.state.notebooks.length == 0 ){
      return(null);
    }
    let chunks = _.chunk(this.state.notebooks,3);
    let childKey = 0;
    let rowKey = 0;
    let notebookViews = _.map(chunks, (notebooks,index) =>{
      let notebookChildren = _.map(notebooks, (notebook,notebookIndex)=>{
        childKey = childKey+1;
        return (
          <Col xs={12} md={4} key={childKey}>
            <Panel header={ <h3> {notebook.title}  <Glyphicon glyph="star" /></h3> } bsStyle="primary" onClick={this.onNotebookClick.bind(this,childKey)}>
              <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
              <Label className="center" bsStyle="default">{notebook.lastEdit}</Label>
            </Panel>
          </Col>
        );
      });
      rowKey = rowKey+1;
      return (
        <Row className='show-grid' key={rowKey}>
          {notebookChildren}
        </Row>
      )
    });
    return notebookViews;
  }

  render() {
    let notebookViews = this.renderNotebooks();
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop'/>
        {this.renderDetailDock()}
        <Grid>
          {notebookViews}
        </Grid>
      </div>
    );
  }

}

export default NotebookView;
