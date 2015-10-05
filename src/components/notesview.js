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
require('../css/notesview.css');
@connectToStores
class NotesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notebookId: props.params.notebookId,
      noteBookStore: {
        notebooks:[]
      },
      windowStore:{
        width:window.innerWidth,
        height:window.innerHeight
      }
    }
    this.onChange = this.onChange.bind(this);
    this.onWindowChange = this.onWindowChange.bind(this);
    this.onNoteClick = this.onNoteClick.bind(this);
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
    if(this.state.noteBookStore.notebooks.length != nextState.noteBookStore.notebooks.length ){
      return true
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

  onNoteClick(index){
    console.log(index)
    let location = `${window.location.pathname}/note/${index-1}/edit`;
    window.location.replace(location);
  }

  renderNotes() {
    if(this.state.noteBookStore.notebooks.length == 0){
      return(null);
    }
    let notebook = this.state.noteBookStore.notebooks[this.state.notebookId];
    let chunks = this.state.windowStore.width <= 991? _.chunk(notebook.notes,2): _.chunk(notebook.notes,3);
    let childKey = 0;
    let rowKey = 0;
    let notebookViews = _.map(chunks, (notes,index) =>{
      let notebookChildren = _.map(notes, (note,notebookIndex)=>{
        childKey = childKey+1;
        return (
          <Col xs={12} md={4} key={childKey} className='notebookcol'>
            <Panel className='note-panel' header={ <h3> {note.title}  <Glyphicon glyph="star" /></h3> } bsStyle="primary" onClick={this.onNoteClick.bind(this,childKey)}>
              <Thumbnail className="notebook-icon" href="#" alt="171x180" bsSize="xsmall" src="https://cdn3.iconfinder.com/data/icons/eldorado-stroke-education/40/536065-notebook-512.png"/>
              {note.preview}
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
    let notebookViews = this.renderNotes();
    let notebook = this.state.noteBookStore.notebooks[this.state.notebookId];
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop' height={this.state.windowStore.height} width={this.state.windowStore.width}/>
        {this.state.noteBookStore.notebooks.length != 0? <div><h1><Label className='notebook-label'>{notebook.title}</Label></h1></div>:null}
        <Grid>
          {notebookViews}
        </Grid>
      </div>
    );
  }

}

export default NotesView;
