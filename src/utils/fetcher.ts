import axios from 'axios';

export default async function (args: any) {
	try {
		const response = await axios.get(args);
		return response.data;
	} catch (err) {
		console.log(err);
	}
}
