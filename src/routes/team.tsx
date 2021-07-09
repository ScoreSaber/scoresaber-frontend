import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar';
import { ScoreSaberTeam } from '../entities/ScoreSaberTeam';
import fetch from '../utils/fetcher';
import useSWR from 'swr';
import TeamItem from '../components/team/team-item';
import BeatLoader from 'react-spinners/BeatLoader';

export default function Team() {
   const { data: team } = useSWR<ScoreSaberTeam>('https://raw.githubusercontent.com/Umbranoxio/ScoreSaber-Team/main/team.json', fetch);
   if (team) {
      console.log(team.TeamMembers);
   }
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
                        <h2 className="title is-5">Creator &amp; Project Lead</h2>
                        <div className="columns is-multiline">
                           {team &&
                              team.TeamMembers.Backend.map((member) => {
                                 return <TeamItem key={member.Name} position={''} teamMember={member} />;
                              })}
                        </div>
                        <h2 className="title is-5">PC Mod</h2>
                        <div className="columns is-multiline">
                           {team &&
                              team.TeamMembers.Mod.map((member) => {
                                 return <TeamItem key={member.Name} position={''} teamMember={member} />;
                              })}
                        </div>
                        <h2 className="title is-5">PPv3</h2>
                        <div className="columns is-multiline">
                           {team &&
                              team.TeamMembers.PPv3.map((member) => {
                                 if (member.Name !== 'Umbranox') {
                                    return <TeamItem key={member.Name} position={''} teamMember={member} />;
                                 } else {
                                    return null;
                                 }
                              })}
                        </div>
                        <h2 className="title is-5">Admin</h2>
                        <div className="columns is-multiline">
                           {team &&
                              team.TeamMembers.Admin.map((member) => {
                                 if (member.Name != 'Umbranox') {
                                    return <TeamItem key={member.Name} position={''} teamMember={member} />;
                                 } else {
                                    return null;
                                 }
                              })}
                        </div>
                        <h2 className="title is-5">Nomination Assesment Team</h2>
                        <div className="columns is-multiline">
                           {team &&
                              team.TeamMembers.NAT.map((member) => {
                                 return <TeamItem key={member.Name} position={''} teamMember={member} />;
                              })}
                        </div>
                        <h2 className="title is-5">Ranking Team</h2>
                        <div className="columns is-multiline">
                           {team &&
                              team.TeamMembers.RT.map((member) => {
                                 return <TeamItem key={member.Name} position={''} teamMember={member} />;
                              })}
                        </div>
                        <h2 className="title is-5">Quality Assurance Team</h2>
                        <div className="columns is-multiline">
                           {team &&
                              team.TeamMembers.QAT.map((member) => {
                                 return <TeamItem key={member.Name} position={''} teamMember={member} />;
                              })}
                        </div>
                        <h2 className="title is-5">Criteria Assesment Team</h2>
                        <div className="columns is-multiline">
                           {team &&
                              team.TeamMembers.CAT.map((member) => {
                                 return <TeamItem key={member.Name} position={''} teamMember={member} />;
                              })}
                        </div>
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
