import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import LandingPageComponent from 'components/landingpage.js';
import ExampleComponent from 'components/example';
import NotebookView from 'components/notebookview';
import NotesView from 'components/notesview'
import NoteEditView from 'components/noteEditView'
import EditUserSettingsView from 'components/editUserSettingsView';
import ManageNotebookView from 'components/ManageNotebookView';
import EveryoneNoteView from 'components/EveryoneNoteView';
import App from 'components/app'


const routes = (
  <Route handler={App} >
    <Route name='Landing Page' path='/' handler={LandingPageComponent}/>
    <Route name='example' path='/example' handler={ExampleComponent}/>
    <Route name='notebooks' path='/notebooks' handler={NotebookView}/>
    <Route name='notes' path='/notebooks/:notebookId' handler={NotesView}/>
    <Route name='note edit' path='/notebooks/:notebookId/note/:noteId/edit/:type' handler={NoteEditView}/>
    <Route name='user edit' path='/editUserSettings' handler={EditUserSettingsView}/>
    <Route name='notebook manage' path='/notebooks/:notebookId/manage' handler={ManageNotebookView}/>
    <Route name='all notes' path='/notebooks/:notebookId/topic/:topicId' handler={EveryoneNoteView}/>
  </Route>
);

export default routes;
