import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import DummyStore from 'stores/dummyStore';
import DummyActions from 'actions/dummyActions';
import NotionNavBar from 'components/ui/notionNavBar';

require('../css/landingpage.css');
@connectToStores
class NotebookView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      router: props.router
    }
  }

  componentWillMount() {
      document.body.style.backgroundImage = null;
  }

  static getStores(props) {
    return [DummyStore];
  }

  static getPropsFromStores(props) {
    return DummyStore.getState();
  }

  render() {
    return (
      <div className='container landingContainer span5 fill'>
        <NotionNavBar name='Notion' style='fixedTop'router={this.state.router}/>
        <input type="text" value={this.state.name} onChange={this.onChange}/>
        <h1>It works: {this.props.name}</h1>
      </div>
    );
  }

  onChange = evt => {
    this.setState({name: evt.target.value});
    DummyActions.updateName(evt.target.value);
  }
}

export default NotebookView;
