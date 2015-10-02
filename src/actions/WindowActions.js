import flux from 'control';
import {createActions} from 'alt/utils/decorators';

@createActions(flux)
class WindowActions {
  constructor() {
  }

  setDimensions(dimensions){
    this.dispatch(dimensions);
  }


}

export default WindowActions;
