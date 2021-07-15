import { Badge } from '../../entities/PlayerData';
import * as helpersUtil from '../../utils/helpers';

type BadgeItemProperties = {
   index: number;
   badge: Badge;
};

export default function BadgeItem(properties: BadgeItemProperties) {
   let badgeClass = 'image is-badge';
   if (properties.index === 0) {
      badgeClass = `${badgeClass} first`;
   }

   let badgeImage = '/images/dev-badge.png';
   if (helpersUtil.isProd()) {
      badgeImage = `/api/static/badges/${properties.badge.image}`;
   }
   return (
      <div id="badge">
         <img className={badgeClass} src={badgeImage} alt={properties.badge.description} title={properties.badge.description} />
      </div>
   );
}
