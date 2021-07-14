import { TeamMember } from '../../entities/ScoreSaberTeam';
import TeamMemberItem from './team-member-item';

export type TeamItemProperties = {
   title: string;
   teamMembers: TeamMember[];
   removeUmbra?: boolean;
};

export default function TeamHeader(properties: TeamItemProperties) {
   const { title, teamMembers, removeUmbra } = properties;
   return (
      <div className="team-panel">
         <h2 className="title is-5">{title}</h2>
         <div className="columns is-multiline">
            {teamMembers &&
               teamMembers.map((member) => {
                  if (removeUmbra && member.Name === 'Umbranox') {
                     return null;
                  } else {
                     return <TeamMemberItem key={member.Name} position={''} teamMember={member} />;
                  }
               })}
         </div>
      </div>
   );
}
