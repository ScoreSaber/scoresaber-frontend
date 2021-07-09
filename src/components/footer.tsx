import DarkModeToggler from './dark-toggle';
import { Link } from 'react-router-dom';
export default function Footer() {
   return (
      <footer className="footer">
         <div className="content has-text-centered">
            <p>
               <strong>ScoreSaber</strong> by <a href="https://twitter.com/Umbranoxus">Umbranox</a> &amp; <Link to="/team">Team</Link>
            </p>
            <p>
               <a href="https://scoresaber.com/legal/privacy">Privacy Policy</a>
            </p>
            <DarkModeToggler />
         </div>
      </footer>
   );
}
