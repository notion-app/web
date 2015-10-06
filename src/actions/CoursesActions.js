import flux from 'control';
import {createActions} from 'alt/utils/decorators';


@createActions(flux)
class CoursesActions {
  constructor() {
  }

  fetchCourses(){
    let courses = [
      {
        title: 'CS 180',        
      },
      {
        title: 'CS 182',
      },
      {
        title: 'CS 240',
      },
      {
        title: 'CS 250',
      },
      {
        title: 'CS 251',
      },
      {
        title: 'CS 252',
      },
      {
        title: 'CS 308',
      },
      {
        title: 'CS 352',
      },
      {
        title: 'CS 352',
      },
      {
        title: 'CS 348',
      },
      {
        title: 'CS 408',
      },
      {
        title: 'CS 490',
      },
      {
        title: 'ECON 251',
      },
      {
        title: 'ECON 252',
      },
      {
        title: 'ECON 451',
      },
      {
        title: 'ECON 471',
      },
      {
        title: 'ECON 490',
      },      
      {
        title: 'MA 251',
      },    
      {
        title: 'MA 252',
      },    
      {
        title: 'MA 265',
      },
    ]
    this.dispatch(courses);
  }

}

export default CoursesActions;
