import { Link } from 'react-router-dom';

export type ErrorProperties = {
	message: string;
};

export default function Error(properties: ErrorProperties) {
	return (
		<div>
			<div className="is-center">
				{properties.message ? (
					<div>
						<p>{properties.message}</p>
					</div>
				) : (
					<p>
						Seems like we ran into an error, to get back to safety, <Link to="/">click here!</Link>
					</p>
				)}
			</div>
		</div>
	);
}
