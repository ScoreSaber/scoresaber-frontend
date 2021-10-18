export interface ScoreSaberTeam {
   TeamMembers: TeamMembers;
}

export interface TeamMembers {
   Backend: TeamMember[];
   Frontend: TeamMember[];
   Mod: TeamMember[];
   PPv3: TeamMember[];
   Admin: TeamMember[];
   NAT: TeamMember[];
   RT: TeamMember[];
   QAT: TeamMember[];
   CAT: TeamMember[];
}

export interface TeamMember {
   Name: string;
   ProfilePicture: string;
   Discord?: string;
   GitHub?: string;
   Twitch?: string;
   Twitter?: string;
   YouTube?: string;
}
