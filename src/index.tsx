import React from 'react';
import ReactDOM from 'react-dom';
import ScoreSaber from './app';
import { AppProvider } from './context';

ReactDOM.render(
   <React.StrictMode>
      <AppProvider>
         <ScoreSaber />
      </AppProvider>
   </React.StrictMode>,
   document.getElementById('root')
);
