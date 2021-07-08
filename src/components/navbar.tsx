import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
	useEffect(() => {
		let burger = document.getElementsByClassName('navbar-burger')[0] as HTMLElement;
		if (burger) {
			burger.addEventListener('click', () => {
				let target = document.getElementById(burger.dataset['target'] || '');
				burger.classList.toggle('is-active');
				if (target) {
					target.classList.toggle('is-active');
				}
			});
		}
		// if (props.initialSearch !== undefined) {
		// 	(document.getElementById('search') as HTMLInputElement).value = props.initialSearch;
		// }
	}, []);
	return (
		<nav id="navbar" className="navbar has-border" aria-label="main navigation">
			<div className="container">
				<div className="navbar-brand">
					<Link to="/" className="navbar-item">
						<img src="/images/logo.svg" className="logo" alt="Logo" />
						<b>Score Saber</b>
					</Link>
					<button className="navbar-burger is-button" data-target="navMenu" aria-label="menu" aria-expanded="false">
						<span aria-hidden="true" />
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</button>
				</div>
				<div className="navbar-menu" id="navMenu">
					<div className="navbar-start">
						<a href="https://scoresaber.com" className="navbar-item">
							Leaderboards
						</a>
						<Link to="/rankings" className="navbar-item">
							Global Ranking
						</Link>
						<a href="https://scoresaber.com/faq" className="navbar-item">
							FAQ &amp; External Links
						</a>
						<Link to="/ranking/requests" className="navbar-item">
							View Rank Requests
						</Link>
					</div>
					<div className="navbar-end">
						<a className="navbar-item" target="_blank" rel="noopener noreferrer" href="https://discord.gg/WpuDMwU">
							<i className="fab fa-discord fa-2x" title="Join the ScoreSaber Discord!" />
						</a>
						<a className="navbar-item" target="_blank" rel="noopener noreferrer" href="https://twitter.com/ScoreSaber">
							<i className="fab fa-twitter fa-2x" title="Follow us on Twitter for updates!" />
						</a>
						<a className="navbar-item donate" target="_blank" rel="noopener noreferrer" href="https://www.patreon.com/scoresaber">
							<i className="fab fa-gratipay fa-2x" title="Support us on Patreon!" />
						</a>
						<div className="field has-addons navbar-item">
							<div className="control is-expanded">
								<input
									// onKeyPress={handleKeyPressed}
									className="input"
									size={35}
									id="search"
									name="search"
									defaultValue=""
									type="search"
									placeholder="Search Username"
									aria-label="Search"
								/>
							</div>
							<div className="control">
								<button className="button is-dark has-background-grey-dark">Search</button>
								{/* <button onClick={handleSearchClick} className="button is-dark has-background-grey-dark">
									Search
								</button> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
