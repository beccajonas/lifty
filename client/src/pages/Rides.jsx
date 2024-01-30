import { useState, useEffect } from 'react';
import RideFeedList from '../components/RideFeedList';

function Rides() {
	const [rides, setRides] = useState([]);

	useEffect(() => {
		fetch(`/api/rides`)
			.then((res) => res.json())
			.then((data) => setRides(data));
	}, []);

	return (
		<div>
			<h1>Rides Here</h1>
			<RideFeedList rides={rides} />
		</div>
	);
}

export default Rides;
