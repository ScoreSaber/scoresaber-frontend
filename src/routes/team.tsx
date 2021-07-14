import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar';
import { ScoreSaberTeam } from '../entities/ScoreSaberTeam';
import fetch from '../utils/fetcher';
import useSWR from 'swr';
import TeamItem from '../components/team/team-item';
import BeatLoader from 'react-spinners/BeatLoader';

export default function Team() {
   const { data: team } = useSWR<ScoreSaberTeam>('https://raw.githubusercontent.com/Umbranoxio/ScoreSaber-Team/main/team.json', fetch);
   return (
      <div>
         <Navbar />
         <Helmet>
            <title>ScoreSaber Team!</title>
         </Helmet>
         <div className="section">
            <div className="container">
               <div className="box has-shadow">
                  <h1 className="title is-4">The ScoreSaber Team</h1>
                  {team ? (
                     <div>
                        <TeamItem title={'Creator & Project Lead'} teamMembers={team.TeamMembers.Backend} />
                        <TeamItem title={'PPv3'} teamMembers={team.TeamMembers.PPv3} removeUmbra={true} />
                        <TeamItem title={'Admin'} teamMembers={team.TeamMembers.Admin} removeUmbra={true} />
                        <TeamItem title={'Nomination Assesment Team'} teamMembers={team.TeamMembers.NAT} />
                        <TeamItem title={'Ranking Team'} teamMembers={team.TeamMembers.RT} />
                        <TeamItem title={'Quality Assurance Team'} teamMembers={team.TeamMembers.QAT} />
                        <TeamItem title={'Criteria Assesment Team'} teamMembers={team.TeamMembers.CAT} />
                     </div>
                  ) : (
                     <div className="sweet-loading is-center">
                        <BeatLoader size={15} color={'#22A7F2'} loading={team} />
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
