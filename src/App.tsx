import 'bulma/css/bulma.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';
import 'bulma-slider/dist/css/bulma-slider.min.css';
import 'bulma-slider/dist/js/bulma-slider';
import 'bulma-checkradio/dist/css/bulma-checkradio.min.css';
import './stylesheets/scoresaber.scss';

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import useSWR, { SWRConfig, mutate } from 'swr';

import axios from 'axios';
import fetch from './utils/fetcher';
import Index from './routes';

import Footer from './components/footer';

function App() {
	return (
		<SWRConfig value={{ fetcher: fetch }}>
			<HelmetProvider>
				<Router>
					<Route path="/" exact component={Index} />
					<Footer />
				</Router>
			</HelmetProvider>
		</SWRConfig>
	);
}

export default App;
