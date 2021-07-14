import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar';
import queryString from 'query-string';
import fetch from '../utils/fetcher';
import useSWR from 'swr';
import { Player } from '../entities/PlayerData';
import BeatLoader from 'react-spinners/BeatLoader';
import Error from '../components/error';
import ArrowPagination from '../components/arrow-pagination';
import RankingPlayerItem from '../components/rankings/player-item';
import { useHistory, useLocation } from 'react-router-dom';

interface PageRequestParams {
   search?: string;
   countries?: string;
   page: number | undefined;
}

export default function Rankings() {
   const history = useHistory();
   const parsed = queryString.parse(useLocation().search);
   const requestParams: PageRequestParams = parsed as unknown as PageRequestParams; // Cause queryString.parse<PageRequestParams> doesn't exist (╯°□°）╯︵ ┻━┻)
   const playersPerPage = 50;

   const { data: rankings, error: rankingsError } = useSWR<Player[]>(queryString.stringifyUrl({ url: '/api/players', query: parsed }), fetch);
   const { data: playerCount, error: playerCountError } = useSWR<number>(queryString.stringifyUrl({ url: '/api/players/count', query: parsed }), fetch);

   const changePage = (page: number) => {
      requestParams.page = page;
      updateUrl(requestParams);
   };

   const handleSearch = (searchTerm: string) => {
      if (searchTerm === '') {
         requestParams.search = undefined;
         changePage(1);
      } else {
         requestParams.search = searchTerm;
         requestParams.page = undefined;
         updateUrl(requestParams);
      }
   };

   const updateUrl = (pageRequestParams: PageRequestParams) => {
      history.push(`/rankings?${queryString.stringify(pageRequestParams)}`);
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
                        <h4 className="title is-4">Player Rankings:</h4>
                        <div className="box has-shadow">
                           {rankingsError && <Error message={rankingsError.message} />}
                           {rankings && playerCount && !rankingsError && !playerCountError ? (
                              <div>
                                 <ArrowPagination page={requestParams.page} callback={changePage} maxPages={Math.ceil(playerCount / playersPerPage)} />
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
                                                return <RankingPlayerItem key={player.id} player={player} />;
                                             })}
                                       </tbody>
                                    </table>
                                 </div>
                                 <ArrowPagination page={requestParams.page} callback={changePage} maxPages={Math.ceil(playerCount / playersPerPage)} />
                              </div>
                           ) : (
                              <div className="sweet-loading is-center">
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
