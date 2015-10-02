import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/WindowActions';

@createStore(flux)
class WindowStore {
  height = null;
  width = null;

  @bind(actions.setDimensions)
  onSetWidthAndHeight(dimensions){
    this.height = dimensions.height;
    this.width = dimensions.width;
  }

}

export default WindowStore;
