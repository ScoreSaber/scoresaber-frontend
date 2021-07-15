import React from 'react';
import ReactDOM from 'react-dom';
import ScoreSaber from './app';
import { AppProvider } from './context';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
JavascriptTimeAgo.locale(en);

ReactDOM.render(
   <React.StrictMode>
      <AppProvider>
         <ScoreSaber />
      </AppProvider>
   </React.StrictMode>,
   document.getElementById('root')
);
