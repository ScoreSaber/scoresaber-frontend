import 'bulma/css/bulma.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';
import 'bulma-slider/dist/css/bulma-slider.min.css';
import 'bulma-slider/dist/js/bulma-slider';
import 'bulma-checkradio/dist/css/bulma-checkradio.min.css';
import './stylesheets/scoresaber.scss';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import useSWR, { SWRConfig, mutate } from 'swr';
import { AppContext, ActionType } from './context';

import fetch from './utils/fetcher';
import axios from 'axios';
import Index from './routes';
import Rankings from './routes/rankings';
import Team from './routes/team';

import Footer from './components/footer';
import { GetTokenResponse } from './entities/AuthResponses';
import { UserData } from './entities/UserData';
import { useContext } from 'react';

const ScoreSaber = () => {
   const { dispatch } = useContext(AppContext);

   let attempts: number = 0;

   const onUserCheckSuccess = async () => {
      let token = localStorage.getItem('login-token');
      if (token) {
         const remoteToken = await axios.get<GetTokenResponse>('/api/auth/getToken');
         if (remoteToken) {
            localStorage.setItem('login-token', remoteToken.data.token);
         }
      }
   };

   const onUserCheckError = async () => {
      if (attempts < 3) {
         let token = localStorage.getItem('login-token');
         if (token) {
            const result = await axios.post('/api/auth/checkToken', { token });
            if (result.status === 200) {
               mutate('/api/user/@me');
               attempts++;
            }
         }
      }
   };

   const { data: user, error } = useSWR<UserData>('/api/user/@me', fetch, {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      errorRetryCount: 3,
      onSuccess: onUserCheckSuccess,
      onError: onUserCheckError,
   });

   if (user) {
      dispatch({ type: ActionType.SetUser, payload: user });
   }

   if (error) {
      dispatch({ type: ActionType.SetUser, payload: undefined });
   }

   return (
      <SWRConfig value={{ fetcher: fetch }}>
         <HelmetProvider>
            <Router>
               <Route path="/" exact component={Index} />
               <Route path="/team" exact component={Team} />
               <Route path="/rankings" exact component={Rankings} />
               <Footer />
            </Router>
         </HelmetProvider>
      </SWRConfig>
   );
};

export default ScoreSaber;
