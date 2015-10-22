import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/SchoolActions';

@createStore(flux)
class SchoolStore {
  schools = []

  @bind(actions.fetchSchools)
  onFetchSchools(loadedSchools){
    this.schools = this.schools.concat(loadedSchools.schools);
  }

  @bind(actions.setUserSchool)
  onSetUserSchool(){

  }
}

export default SchoolStore;
