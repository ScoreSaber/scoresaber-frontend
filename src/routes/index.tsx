import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar';

export default function Index() {
	return (
		<div>
			<Navbar />
			<Helmet>
				<title>ScoreSaber!</title>
			</Helmet>
		</div>
	);
}
