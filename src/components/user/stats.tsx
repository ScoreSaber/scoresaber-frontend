import { Player, ScoreStats } from '../../models/PlayerData';
import { UserData } from '../../models/UserData';
import RankChart from './chart';
import * as helpersUtil from '../../utils/helpers';
import { Helmet } from 'react-helmet-async';
import * as permissions from '../../utils/permission';
import { Img } from 'react-image';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';

type StatsProperties = {
   userData?: UserData;
   player: Player;
   scoreStats: ScoreStats;
   banCallback: BanCallback;
   unbanCallback: UnbanCallback;
   giveRoleCallback: GiveRoleCallback;
   statsRefreshCallBack: StatsRefreshCallBack;
};

export interface StatsRefreshCallBack {
   (): void;
}

export interface BanCallback {
   (reason: string): void;
}

export interface UnbanCallback {
   (): void;
}

export interface GiveRoleCallback {
   (role: string): void;
}

export default function Stats(properties: StatsProperties) {
   const { userData, player, scoreStats } = properties;
   let flagPath = '/images/flags/unknown.png';
   if (helpersUtil.isProd()) {
      flagPath = `/api/static/flags/${player.country.toLowerCase()}.png`;
   }
   return (
      <div className="columns">
         <Helmet>
            <title>{player.name}'s Profile | ScoreSaber!</title>
         </Helmet>
         <div className="column is-narrow avatar">
            <Img alt="Profile" className="image is-96x96 profile" src={player.profilePicture} loader={<img src="/images/placeholder.jpg" className="image is-96x96 profile" />} />

            {permissions.checkPermission(userData, permissions.ADMIN) && (
               <div>
                  <div className="user-manage-selector">
                     {!player.banned ? (
                        <div className="select is-small">
                           <select id="roles">
                              <option value="rtr">RT Recruit</option>
                              <option value="rt">RT</option>
                              <option value="qat">QAT</option>
                              <option value="cat">CAT</option>
                              <option value="nat">NAT</option>
                              <option value="qathead">QAT Head</option>
                           </select>
                           <button
                              onClick={() => properties.giveRoleCallback((document.getElementById('roles') as HTMLInputElement).value)}
                              className="button is-small is-info user-manage-button"
                           >
                              Give Role
                           </button>
                           <input id="reason" className="input is-small is-warning user-manage-button" type="text" placeholder="Ban Reason" />
                           <button
                              onClick={() => properties.banCallback((document.getElementById('reason') as HTMLInputElement).value)}
                              className="button user-manage-button is-danger is-small"
                           >
                              Ban
                           </button>
                        </div>
                     ) : (
                        <button onClick={() => properties.unbanCallback} className="button user-manage-button is-info is-small">
                           Unban
                        </button>
                     )}
                  </div>
               </div>
            )}
         </div>
         {!player.banned ? (
            <div className="column">
               <h5 className="title is-5">
                  <img alt="Country" src={flagPath} />
                  {parseInt(player.id) >= 70000000000000000 ? (
                     <a target="_blank" rel="noopener noreferrer" href={`https://steamcommunity.com/profiles/${player.id}`}>
                        {' ' + player.name}
                     </a>
                  ) : (
                     <Link to="#">{' ' + player.name}</Link>
                  )}
                  {parseInt(player.id) >= 70000000000000000 && (
                     <div onClick={() => properties.statsRefreshCallBack()} className="button profile icon is-medium-small" data-tooltip="Refresh user profile picture & name">
                        <i className="fas fa-sync-alt" />
                     </div>
                  )}
               </h5>

               <ul>
                  <li>
                     <strong>Player Ranking:</strong>{' '}
                     <Link to={`/rankings/${helpersUtil.rankToPage(player.rank, 50)}`}>
                        #<NumberFormat value={player.rank} displayType={'text'} thousandSeparator={true} />
                     </Link>{' '}
                     - ({' '}
                     <Link to={`/rankings/country/${player.country.toLowerCase()}/${helpersUtil.rankToPage(player.countryRank, 50)}`}>
                        <img alt="Country" src={flagPath} /> #<NumberFormat value={player.countryRank} displayType={'text'} thousandSeparator={true} />
                     </Link>{' '}
                     )
                  </li>
                  <li>
                     <strong>Performance Points:</strong> <NumberFormat value={player.pp} displayType={'text'} thousandSeparator={true} />
                     pp
                  </li>
                  <li>
                     <strong>Total Play Count:</strong> <NumberFormat value={scoreStats.totalPlayCount} displayType={'text'} thousandSeparator={true} />
                  </li>
                  <li>
                     <strong>Ranked Play Count:</strong> <NumberFormat value={scoreStats.rankedPlayCount} displayType={'text'} thousandSeparator={true} />
                  </li>
                  <li>
                     <strong>Total Score:</strong> <NumberFormat value={scoreStats.totalScore} displayType={'text'} thousandSeparator={true} />
                  </li>
                  <li>
                     <strong>Total Ranked Score:</strong>
                     <NumberFormat value={scoreStats.totalRankedScore} displayType={'text'} thousandSeparator={true} />
                  </li>
                  <li>
                     <strong>Average Ranked Accuracy:</strong> <NumberFormat value={scoreStats.averageRankedAccuracy} displayType={'text'} thousandSeparator={true} />%
                  </li>
                  {player.role !== '' && player.role !== null && (
                     <li>
                        <strong>Role:</strong> {player.role}
                     </li>
                  )}
               </ul>
               <section className="rankChart">
                  <RankChart histories={player.histories} currentRank={player.rank} />
               </section>
            </div>
         ) : (
            <span>Player banned</span>
         )}
      </div>
   );
}
