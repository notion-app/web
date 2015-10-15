import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/CoursesActions';

@createStore(flux)
class CoursesStore {
  courses = []

  @bind(actions.fetchCourses)
  onFetchCourses(loadedCourses){
    this.courses = this.courses.concat(loadedCourses);
  }
}

export default CoursesStore;
