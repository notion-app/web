import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import LandingPageComponent from 'components/landingpage.js';
import ExampleComponent from 'components/example';
import NotebookView from 'components/notebookview';
import App from 'components/app'


const routes = (
  <Route handler={App} >
    <Route name='Landing Page' path='/' handler={LandingPageComponent}/>
    <Route name='example' path='/example' handler={ExampleComponent}/>
    <Route name='notebookview' path='/notebookview' handler={NotebookView}/>
  </Route>
);

export default routes;
