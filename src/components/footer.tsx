import React from 'react';
import DarkModeToggler from './dark-toggle';
export default function Footer() {
	return (
		<footer className="footer">
			<div className="content has-text-centered">
				<p>
					<strong>ScoreSaber</strong> by <a href="https://twitter.com/Umbranoxus">Umbranox</a> &amp; <a href="https://scoresaber.com/faq">Team</a>
				</p>
				<p>
					<a href="https://scoresaber.com/legal/privacy">Privacy Policy</a>
				</p>
				<DarkModeToggler />
			</div>
		</footer>
	);
}
