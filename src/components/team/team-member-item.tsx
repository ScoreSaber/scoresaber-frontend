import { TeamMember } from '../../entities/ScoreSaberTeam';

export type TeamMemberItemProperties = {
   teamMember: TeamMember;
   position?: string;
};

export default function TeamItem(properties: TeamMemberItemProperties) {
   const { teamMember, position } = properties;
   return (
      <div className="column is-one-quarter">
         <div className="columns is-mobile">
            <div className="column is-narrow avatar">
               <img
                  className="image is-60x60"
                  src={`https://raw.githubusercontent.com/Umbranoxio/ScoreSaber-Team/main/images/${teamMember.ProfilePicture}`}
                  alt={teamMember.Name}
               />
            </div>
            <div className="column">
               <h5 className="title is-6">{teamMember.Name}</h5>
               <h6 className="subtitle">{position}</h6>
               {teamMember.GitHub && (
                  <a href={`https://github.com/${teamMember.GitHub}`} target="_blank" rel="noreferrer">
                     <span className="icon">
                        <i className="fab fa-github"></i>
                     </span>
                  </a>
               )}
               {teamMember.Twitch && (
                  <a href={`https://twitch.tv/${teamMember.Twitch}`} target="_blank" rel="noreferrer">
                     <span className="icon">
                        <i className="fab fa-twitch"></i>
                     </span>
                  </a>
               )}
               {teamMember.YouTube && (
                  <a href={`https://youtube.com/channel/${teamMember.YouTube}`} target="_blank" rel="noreferrer">
                     <span className="icon">
                        <i className="fab fa-youtube"></i>
                     </span>
                  </a>
               )}
               {teamMember.Discord && (
                  <a href={`https://discordapp.com/users/${teamMember.Discord}`} target="_blank" rel="noreferrer">
                     <span className="icon">
                        <i className="fab fa-discord"></i>
                     </span>
                  </a>
               )}
               {teamMember.Twitter && (
                  <a href={`https://twitter.com/${teamMember.Twitter}`} target="_blank" rel="noreferrer">
                     <span className="icon">
                        <i className="fab fa-twitter"></i>
                     </span>
                  </a>
               )}
            </div>
         </div>
      </div>
   );
}
