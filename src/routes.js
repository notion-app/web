import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import LandingPageComponent from 'components/landingpage.js';
import ExampleComponent from 'components/example';
import NotebookView from 'components/notebookview';
import NotesView from 'components/notesview'
import NoteEditView from 'components/noteEditView'
import EditUserSettingsView from 'components/EditUserSettingsView';
import ManageNotebookView from 'components/ManageNotebookView';
import App from 'components/app'


const routes = (
  <Route handler={App} >
    <Route name='Landing Page' path='/' handler={LandingPageComponent}/>
    <Route name='example' path='/example' handler={ExampleComponent}/>
    <Route name='notebooks' path='/notebooks' handler={NotebookView}/>
    <Route name='notes' path='/notebooks/:notebookId' handler={NotesView}/>
    <Route name='note edit' path='/notebooks/:notebookId/note/:noteId/edit' handler={NoteEditView}/>
    <Route name='user edit' path='/editUserSettings' handler={EditUserSettingsView}/>
    <Route name='notebook manage' path='/notebooks/:notebookId/manage' handler={ManageNotebookView}/>
  </Route>
);

export default routes;
