import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/CoursesActions';
import _ from 'lodash';

@createStore(flux)
class CoursesStore {
  courses = []
  sections = []

  @bind(actions.fetchCourses)
  onFetchCourses(loadedCourses){
    this.courses = _.uniq(_.union(this.courses, loadedCourses), false, _.property('name'))
  }

  @bind(actions.fetchSections)
  onFetchSections(loadSections){
    this.sections = loadSections;
  }
}

export default CoursesStore;
