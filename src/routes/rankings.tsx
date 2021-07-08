/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar';
import queryString from 'query-string';
import fetch from '../utils/fetcher';
import useSWR, { mutate } from 'swr';
import { Player } from '../entities/PlayerData';
import BeatLoader from 'react-spinners/BeatLoader';
import Error from '../components/error';
import ArrowPagination from '../components/arrow-pagination';
import { useHistory, useLocation } from 'react-router-dom';

interface PageRequestParams {
	search?: string;
	countries?: string;
	page: number;
}

export default function Rankings() {
	const history = useHistory();
	const parsed = queryString.parse(useLocation().search);
	const requestParams: PageRequestParams = parsed as unknown as PageRequestParams;

	const { data: rankings, error: rankingsError } = useSWR<Player[]>(queryString.stringifyUrl({ url: '/api/players', query: parsed }), fetch);

	const handlePageClick = (page: number) => {
		console.log(page);
	};

	const handleSearch = (searchTerm: string) => {
		if (searchTerm === '') {
		} else {
			//setSearchTerm(searchTerm);
		}
	};

	return (
		<div>
			<Navbar searchCallback={handleSearch} />
			<Helmet>
				<title>Global Rankings | ScoreSaber!</title>
			</Helmet>
			<div className="section">
				<div className="container">
					<div className="content">
						<div className="columns is-desktop is-flex-reverse">
							<div className="column is-one-quarter-desktop">
								<h4 className="title is-4">Details:</h4>
								<div className="box has-shadow">
									<p>Earn global rankings simply by playing ranked maps!</p>
									<p>
										Each <strong>ranked</strong> song on ScoreSaber has a hidden difficulty value attached to it determined by the PP algorithm.
									</p>
								</div>
							</div>
							<div className="column">
								<h4 className="title is-4">Global Leaderboards:</h4>
								<div className="box has-shadow">
									{rankingsError && <Error message={rankingsError.message} />}
									{rankings && !rankingsError ? (
										<div>
											<ArrowPagination page={requestParams.page} callback={handlePageClick} maxPages={500} />
											<div className="ranking global">
												<table className="ranking global">
													<thead>
														<tr>
															<th className="picture" />
															<th className="rank">Rank</th>
															<th className="player">Player</th>
															<th className="pp">Performance Points</th>
															<th className="difference">Weekly Change</th>
														</tr>
													</thead>
													<tbody>
														{rankings &&
															rankings.map((player) => {
																//player.name = entities.decode(player.name);
																// return <Player key={player.id} player={player} />;
															})}
													</tbody>
												</table>
											</div>
											<ArrowPagination page={requestParams.page} callback={handlePageClick} maxPages={500} />
											{/* {pages && !pageError && <ArrowPagination page={page} callback={handlePageClick} maxPages={pages.pages} />} */}
										</div>
									) : (
										<div className="sweet-loading">
											<BeatLoader size={15} color={'#22A7F2'} loading={!rankingsError} />
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
