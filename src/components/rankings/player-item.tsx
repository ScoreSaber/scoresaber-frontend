import { Link } from 'react-router-dom';
import { Img } from 'react-image';
import { Player } from '../../entities/PlayerData';
import NumberFormat from 'react-number-format';
import { decode } from 'html-entities';
import * as helpers from '../../utils/helpers';

type RankingPlayerItemProperties = {
	player: Player;
};

export default function RankingPlayerItem(properties: RankingPlayerItemProperties) {
	const { player } = properties;
	player.name = decode(player.name);
	var flagPath = '/images/flags/unknown.png';
	if (helpers.isProd()) {
		flagPath = '/api/static/flags/' + player.country.toLowerCase() + '.png';
	}
	return (
		<tr>
			<td className="picture">
				<figure className="image is-24x24">
					<Img
						loading="lazy"
						className="global"
						alt={player.name + "'s profile image"}
						src={player.profilePicture}
						loader={<img src="/images/placeholder.jpg" alt="placeholder" className="image rounded" />}
					/>
				</figure>
			</td>
			<td className="rank">
				#<NumberFormat value={player.rank} displayType={'text'} thousandSeparator={true} />
			</td>
			<td className="player">
				<Link to={'/u/' + player.id}>
					<img alt={player.country + ' flag'} src={flagPath} />
					<span className="songTop pp-global"> {player.name}</span>
				</Link>
			</td>
			<td className="pp">
				<span className="scoreTop ppValue">
					<NumberFormat value={player.pp} displayType={'text'} thousandSeparator={true} />
				</span>
				<span className="scoreTop ppLabel">pp</span>
			</td>
			<td className="difference">
				{/* {player.difference > 0 && <span className="difference positive">+{helpersUtil.number_format(player.difference)}</span>}
				{player.difference < 0 && <span className="difference negative">{helpersUtil.number_format(player.difference)}</span>}
				{player.difference === 0 && <span className="difference neutral">{helpersUtil.number_format(player.difference)}</span>} */}
			</td>
		</tr>
	);
}
