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
    this.onOpenNotebook = this.onOpenNotebook.bind(this);
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

  onNoteClick(index){
    location = `/notebooks/${this.state.currentSelectedNotebook}/note/${index}/edit`;
  }

  renderNotes(notebook){
    if(notebook != null){
      if(notebook.notes.length == 0){
        return(null);
      }

      let chunks = _.chunk(notebook.notes,3);
      let first = chunks[0];
      let notebookChildren = _.map(first, (note,index)=>{
        return (
          <Col xs={12} md={4} className='notecol' onClick={this.onNoteClick.bind(this,index)}>
            <Panel header={<h3>{note.title}</h3>} bsStyle='primary'>
              {note.preview}
            </Panel>
          </Col>
        )
      });
      return notebookChildren;
    }
  }

  onOpenNotebook(){
    let location = `/notebooks/${this.state.currentSelectedNotebook}`;
    window.location.replace(location);
  }

  renderDetailDock(){
    if(this.state.currentSelectedNotebook == null){
      return(null);
    }
    let notebook = this.state.noteBookStore.notebooks[this.state.currentSelectedNotebook];
    this.renderNotes(notebook)
    return (
      <Dock position='bottom' isVisible={this.state.detailDockVisable} onVisibleChanged={this.handleVisibleChanged} flud={true} size={.50}>
        <div className='detailDock'>
          <Grid>
            <Col>
              <Panel className='deatilPanel' header={ <h3> {notebook.title}  <Glyphicon glyph="star" /></h3> } bsStyle="primary">
                <Row className='center'>
                  <Thumbnail className="notebook-icon notebookimg img img-responsive" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
                </Row>
                <Label className="center" bsStyle="default">{notebook.lastEdit}</Label>
                  <ButtonToolbar className='detailToolbar'>
                      <Button className='openButton' onClick={this.onOpenNotebook}>
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
              {this.renderNotes(notebook)}
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
    let chunks = this.state.windowStore.width <= 991? _.chunk(this.state.noteBookStore.notebooks,2): _.chunk(this.state.noteBookStore.notebooks,3);
    let childKey = 0;
    let rowKey = 0;
    let notebookViews = _.map(chunks, (notebooks,index) =>{
      let notebookChildren = _.map(notebooks, (notebook,notebookIndex)=>{
        childKey = childKey+1;
        return (
          <Col xs={12} md={4} key={childKey} className='notebookcol'>
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
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
        {this.renderDetailDock()}
        <Grid>
          {notebookViews}
        </Grid>
      </div>
    );
  }

}

export default NotebookView;
