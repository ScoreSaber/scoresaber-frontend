import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar';

export default function Index() {
   return (
      <div>
         <Navbar />
         <Helmet>
            <title>ScoreSaber!</title>
         </Helmet>
         <section className="section is-fullwidth no-padding">
            <div className="bd-example">
               <section className="hero is-custom is-banner is-bold">
                  <div className="hero-body">
                     <div className="container">
                        <div className="columns is-mobile is-centered">
                           <div className="column is-half"></div>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         </section>

         <div className="section">
            <div className="container">
               <div className="content">
                  <div className="columns">
                     <div className="column">
                        <div className="box has-shadow">
                           <h3>Welcome to ScoreSaber</h3>
                           <p>
                              ScoreSaber is Beat Sabers largest leaderboard system for custom songs, hosting 60 million scores across 170,000+ leaderboards, with more than 1
                              million users worldwide
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
