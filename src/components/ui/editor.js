import React, { PropTypes as T } from 'react'
import marked from 'marked'
import cNames from 'classnames'
import NotebookActions from 'actions/NotebookActions';
import LoginManager from 'util/LoginManager';
import ot from 'ot';
import API_ROOT from 'util/RouteDetails';

let ws = null;

require('../..//less/editor.less');

const MdEditor = React.createClass({
  propTypes: {
    content: T.string,
    children: T.node
  },
  getInitialState () {
    let type = location.pathname.split('/').pop();
    let mode = '';
    type === 'editMode'? mode='split': mode='preview'
    return {
      user: LoginManager.getAuthInfo(),
      panelClass: 'md-panel',
      mode: mode,
      isFullScreen: false,
      result: marked(this.props.content || ''),
      content: this.props.content || '',
      note: this.props.note,
      notebookId: this.props.notebookId,
      type: type
    }
  },
  onWebSocketOnOpen() {
    console.log('web socket open!!');
  },
  onWebSocketError(err) {
    console.log(err);
  },
  onWebSocketMessage(evt){
    let message = evt.data;
    console.log(data);

  },
  componentDidMount () {
    // cache dom node
    let socketUrl = `ws://notion-api-dev.herokuapp.com/v1/note/${this.state.note.id}/ws?token=${this.state.user.fbData.fb_auth_token}`;
    ws = new WebSocket(socketUrl);
    ws.onopen = this.onWebSocketOnOpen;
    ws.onerror = this.onWebSocketError;
    ws.onmessage = this.onWebSocketMessage;

    this.textControl = React.findDOMNode(this.refs.editor)
    this.previewControl = React.findDOMNode(this.refs.preview)
  },
  componentWillUnmount () {
    this.textControl = null
    this.previewControl = null
  },
  render () {
    const panelClass = cNames([ 'md-panel', { 'fullscreen': this.state.isFullScreen } ])
    const editorClass = cNames([ 'md-editor', { 'expand': this.state.mode === 'edit' } ])
    const previewClass = cNames([ 'md-preview', 'markdown', { 'expand': this.state.mode === 'preview', 'shrink': this.state.mode === 'edit' } ])

    return (
      <div className={panelClass}>
        <div className="md-menubar">
          {this._getModeBar()}
          {this._getToolBar()}
        </div>
        <div className={editorClass}>
          <textarea  defaultValue={this.state.content} ref="editor" name="content" onChange={this._onChange}></textarea>{/* style={{height: this.state.editorHeight + 'px'}} */}
        </div>
        <div className={previewClass} ref="preview" dangerouslySetInnerHTML={{ __html: this.state.result }}></div>
        <div className="md-spliter"></div>
      </div>
    )
  },
  // public methods
  isDirty () {
    return this._isDirty || false
  },
  getValue () {
    return this.state.content
  },
  // widgets constructors
  _getToolBar () {
    if(this.state.type === 'editMode') {
      return (
        <ul className="md-toolbar clearfix">
          <li className="tb-btn"><a title="Bold" onClick={this._boldText}><i className="glyphicon glyphicon-bold"></i></a></li>{/* bold */}
          <li className="tb-btn"><a title="Italic" onClick={this._italicText}><i className="glyphicon glyphicon-italic"></i></a></li>{/* italic */}
          <li className="tb-btn spliter"></li>
          <li className="tb-btn"><a title="Link" onClick={this._linkText}><i className="glyphicon glyphicon-link"></i></a></li>{/* link */}
          <li className="tb-btn"><a title="Indent" onClick={this._blockquoteText}><i className="glyphicon glyphicon-indent-right"></i></a></li>{/* blockquote */}
          <li className="tb-btn"><a title="Code" onClick={this._codeText}><i className="glyphicon glyphicon-eye-close"></i></a></li>{/* code */}
          <li className="tb-btn"><a title="Image" onClick={this._pictureText}><i className="glyphicon glyphicon-picture"></i></a></li>{/* picture-o */}
          <li className="tb-btn spliter"></li>
          <li className="tb-btn"><a title="Ordered List" onClick={this._listOlText}><i className="glyphicon glyphicon-th-list"></i></a></li>{/* list-ol */}
          <li className="tb-btn"><a title="Unorded List" onClick={this._listUlText}><i className="glyphicon glyphicon-list"></i></a></li>{/* list-ul */}
          <li className="tb-btn"><a title="Header" onClick={this._headerText}><i className="glyphicon glyphicon-header"></i></a></li>{/* header */}
          {this._getExternalBtn()}
        </ul>
      )
    }
  },
  _getExternalBtn () {
    return React.Children.map(this.props.children, (option) => {
      if (option.type === 'option') {
        return <li className="tb-btn"><a {...option.props}>{option.props.children}</a></li>
      }
    })
  },
  _getModeBar () {
    const checkActive = (mode) => cNames({ active: this.state.mode === mode })
    if(this.state.type === 'editMode'){
      return (
        <ul className="md-modebar">
          <li className="tb-btn pull-right">
            <a className={checkActive('preview')} onClick={this._changeMode('preview')} title="Markdown Mode">
              <i className="glyphicon glyphicon-eye-open"></i>
            </a>
          </li> { /* preview mode */ }
          <li className="tb-btn pull-right">
            <a className={checkActive('split')} onClick={this._changeMode('split')} title="Preview Mode">
              <i className="glyphicon glyphicon-modal-window"></i>
            </a>
          </li> { /* split mode */ }
          <li className="tb-btn pull-right">
            <a className={checkActive('edit')} onClick={this._changeMode('edit')} title="Split Mode">
              <i className="glyphicon glyphicon-pencil"></i>
            </a>
          </li> { /* edit mode */ }
          <li className="tb-btn spliter pull-right"></li>
          <li className="tb-btn pull-right"><a title="Fullscreen" onClick={this._toggleFullScreen}><i className="glyphicon glyphicon-fullscreen"></i></a></li> {/* full-screen */}
              <li className="tb-btn pull-right"><a title="Save" onClick={this._save}><i className="glyphicon glyphicon-floppy-disk"></i></a></li> {/* full-screen */}
        </ul>
      )
    } else {

    }
  },
  // event handlers
  _onChange (e) {
    this._isDirty = true // set dirty
    if (this._ltr) clearTimeout(this._ltr)
    this._ltr = setTimeout(() => {
      console.log(e);
      ws.send(this.textControl.value);
      console.log(this.textControl.value)
      this.setState({ content: this.textControl.value, result: marked(this.textControl.value) }) // change state
    }, 300)
  },
  _changeMode (mode) {
    return (e) => {
      this.setState({ mode })
    }
  },
  _toggleFullScreen (e) {
    this.setState({ isFullScreen: !this.state.isFullScreen })
  },

  _save(e){
    console.log(this.textControl.value);
    NotebookActions.updateNote(this.state.notebookId, this.state.note.id, this.state.user.fbData.fb_auth_token, this.textControl.value);
  },
  // default text processors
  _preInputText (text, preStart, preEnd) {
    const start = this.textControl.selectionStart
    const end = this.textControl.selectionEnd
    const origin = this.textControl.value

    if (start !== end) {
      const exist = origin.slice(start, end)
      text = text.slice(0, preStart) + exist + text.slice(preEnd)
      preEnd = preStart + exist.length
    }
    this.textControl.value = origin.slice(0, start) + text + origin.slice(end)
    // pre-select
    this.textControl.setSelectionRange(start + preStart, start + preEnd)
    this.setState({ result: marked(this.textControl.value) }) // change state
  },
  _boldText () {
    this._preInputText("**Bold**", 2, 6)
  },
  _italicText () {
    this._preInputText("_Italic_", 1, 5)
  },
  _linkText () {
    this._preInputText("[link](www.yourlink.com)", 1, 5)
  },
  _blockquoteText () {
    this._preInputText("> Block", 2, 4)
  },
  _codeText () {
    this._preInputText("```\ncode block\n```", 4, 14)
  },
  _pictureText () {
    this._preInputText("![alt](www.yourlink.com)", 2, 5)
  },
  _listUlText () {
    this._preInputText("- Item0\n- Item1", 2, 8)
  },
  _listOlText () {
    this._preInputText("1. Item0\n2. Item1", 3, 9)
  },
  _headerText () {
    this._preInputText("## Header", 3, 5)
  }
})

export default MdEditor
