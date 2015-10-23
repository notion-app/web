import flux from 'control';
import {createActions} from 'alt/utils/decorators';
import API_ROOT from 'util/RouteDetails';
import $ from 'jquery';


@createActions(flux)
class CoursesActions {
  constructor() {
  }

  fetchCourses(school_id){
    let path = `${API_ROOT}/school/${school_id}/course`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'GET',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((courses) => {
      this.dispatch(courses);
    });
  }

  fetchSections(school_id,course_id){
    let path = `${API_ROOT}/school/${school_id}/course/${course_id}/section`;
    $.ajax({
      url:path,
      crossDomain:true,
      method:'GET',
      error: function(xhr,options,error){
        console.log(error);
      }
    }).done ((sections) => {
      this.dispatch(sections);
    });
  }

}

export default CoursesActions;
