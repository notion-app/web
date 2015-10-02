import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import NotebookStore from 'stores/NotebookStore';
import WindowStore from 'stores/WindowStore';
import WindowActions from 'actions/WindowActions';
import NotebookActions from 'actions/NotebookActions';
import NotionNavBar from 'components/ui/notionNavBar';
import { Button, ButtonToolbar, Nav, Navbar, NavItem, Jumbotron, Grid, Row, Col, Panel, Glyphicon, Thumbnail, Label } from 'react-bootstrap';
import _ from 'lodash';
import Dock from 'react-dock';

require('../css/landingpage.css');
require('../css/notebookview.css');
@connectToStores
class NotebookView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteBookStore: {
        notebooks:[]
      },
      detailDockVisable:false,
      currentSelectedNotebook:null,
      windowStore:{
        width:window.innerWidth,
        height:window.innerHeight
      }
    }
    this.onChange = this.onChange.bind(this);
    this.onWindowChange = this.onWindowChange.bind(this);
    this.renderNotebooks = this.renderNotebooks.bind(this);
    this.handleVisibleChanged = this.handleVisibleChanged.bind(this);
    this.onNotebookClick = this.onNotebookClick.bind(this);
  }

  componentWillMount() {
      document.body.style.backgroundImage = null;
  }

  componentDidMount(){
    NotebookStore.listen(this.onChange);
    WindowStore.listen(this.onWindowChange);
    NotebookActions.fetchNotebooks();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  shouldComponentUpdate(nextProps,nextState){;
    //console.log(this.state);
    //console.log(nextState);
    if(this.state.noteBookStore.notebooks.length != nextState.noteBookStore.notebooks.length ){
      return true
    }

    else if(this.state.detailDockVisable != nextState.detailDockVisable){
      return true;
    }

    else if(this.state.windowStore.width != nextState.windowStore.width){
      return true;

    }

    return false;
  }

  onWindowChange(){
    this.setState({windowStore:WindowStore.getState()});
  }

  updateWindowDimensions(e){
    WindowActions.setDimensions({width:window.innerWidth, height:window.innerHeight});
  }

  onChange(){
    this.setState({noteBookStore:NotebookStore.getState()});
  }


  static getStores(props) {
    return [NotebookStore, WindowStore];
  }

  static getPropsFromStores(props) {
    return NotebookStore.getState();
  }

  handleVisibleChanged(isVisible){
  this.setState({ detailDockVisable:isVisible });
}

  onNotebookClick(index){
    if(this.state.detailDockVisable){
      this.setState({detailDockVisable:false});
    }
    this.setState({currentSelectedNotebook:index-1, detailDockVisable:true});
  }

  renderDetailDock(){
    if(this.state.currentSelectedNotebook == null){
      return(null);
    }
    let notebook = this.state.noteBookStore.notebooks[this.state.currentSelectedNotebook];
    return (
      <Dock position='bottom' isVisible={this.state.detailDockVisable} onVisibleChanged={this.handleVisibleChanged} flud={true} size={.45}>
        <div className='detailDock'>
          <Grid>
            <Col>
              <Panel className='deatilPanel' header={ <h3> {notebook.title}  <Glyphicon glyph="star" /></h3> } bsStyle="primary">
                <Row className='center'>
                  <Thumbnail className="notebook-icon notebookimg" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                </Row>
                <Label className="center" bsStyle="default">{notebook.lastEdit}</Label>
                  <ButtonToolbar className='detailToolbar'>
                      <Button className='openButton'>
                        Open
                      </Button>
                      <Button className='manageButton'>
                        Manage
                      </Button>
                  </ButtonToolbar>
              </Panel>
            </Col>
          </Grid>
          <Grid className='notesGrid'>
            <Row className='show-grid'>
              <Col xs={12} md={4}>
                <Panel header={<h3>Note 1</h3>} bsStyle='primary'>
                  Preview
                </Panel>
              </Col>
              <Col xs={12} md={4}>
                <Panel header={<h3>Note 1</h3>} bsStyle='primary'>
                  Preview
                </Panel>
              </Col>
              <Col xs={12} md={4}>
                <Panel header={<h3>Note 1</h3>} bsStyle='primary'>
                  Preview
                </Panel>
              </Col>
            </Row>
          </Grid>
        </div>
      </Dock>
    );
}


  renderNotebooks() {
    if(this.state.noteBookStore.notebooks.length == 0){
      return(null);
    }
    console.log('render')
    let chunks = this.state.windowStore.width <= 991? _.chunk(this.state.noteBookStore.notebooks,2): _.chunk(this.state.noteBookStore.notebooks,3);
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
