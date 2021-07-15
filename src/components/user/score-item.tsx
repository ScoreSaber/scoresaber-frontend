import { PlayerScore } from '../../entities/PlayerData';
import * as helpersUtil from '../../utils/helpers';
import { Img } from 'react-image';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import NumberFormat from 'react-number-format';

type ScoreProperties = {
   playerScore: PlayerScore;
};

export default function ScoreItem(properties: ScoreProperties) {
   const { playerScore } = properties;
   const { score, leaderboard } = playerScore;
   const difficultyStyle = helpersUtil.getDifficultyStyleFromId(leaderboard.difficulty);
   const difficultyText = helpersUtil.getFriendlyDifficultyFromId(leaderboard.difficulty);
   if (score.multiplier > 1) {
      score.modifiers = `${score.modifiers}`;
   }

   let songImage = '/images/oculus.png';
   if (helpersUtil.isProd()) {
      songImage = `/api/static/covers/${leaderboard.songHash.toUpperCase()}.png`;
   }
   return (
      <tr>
         <th className="rank">
            #<NumberFormat value={score.rank} displayType={'text'} thousandSeparator={true} />
         </th>
         <th className="song">
            <div className="score-container">
               <div className="score-image-wrapper is-hidden-mobile">
                  <Img alt="Cover" title={leaderboard.songAuthorName + ' - ' + score.leaderboardPlayerInfo?.name} src={songImage} loader={<img src="/images/placeholder.jpg" />} />
               </div>
               <div>
                  <Link to={`/leaderboard/${leaderboard.id}`}>
                     <span className="songTop pp">
                        {leaderboard.songAuthorName} - {leaderboard.songName} <span className={difficultyStyle}>{difficultyText}</span>
                     </span>{' '}
                     <span className="songTop mapper">by {leaderboard.levelAuthorName}</span>
                  </Link>
                  <br />
                  <span className="songBottom time">
                     <ReactTimeAgo date={score.timeSet} />
                  </span>
               </div>
            </div>
         </th>
         <th className="score">
            <span className="scoreTop ppValue">
               <NumberFormat value={score.pp} displayType={'text'} thousandSeparator={true} />
            </span>
            <span className="scoreTop ppLabel">pp</span>{' '}
            <span title={'Weighted ' + <NumberFormat value={score.weight * 100} displayType={'text'} thousandSeparator={true} /> + '%'} className="scoreTop ppWeightedValue">
               <NumberFormat value={score.pp * score.weight} displayType={'text'} thousandSeparator={true} />
               <span className="scoreTop ppWeightedLabel">pp</span>)
            </span>
            <br />
            {leaderboard.maxScore === 0 ? (
               <span className="scoreBottom">
                  Score: <NumberFormat value={score.modifiedScore} displayType={'text'} thousandSeparator={true} />
               </span>
            ) : (
               <span title={'Score: ' + <NumberFormat value={score.modifiedScore} displayType={'text'} thousandSeparator={true} />} className="scoreBottom">
                  Accuracy: <NumberFormat value={(score.modifiedScore / leaderboard.maxScore) * 100} displayType={'text'} thousandSeparator={true} />% {score.modifiers}
               </span>
            )}
         </th>
      </tr>
   );
}
