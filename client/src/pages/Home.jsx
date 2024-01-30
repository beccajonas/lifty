import { useState, useEffect } from 'react';
import RideFeedList from '../components/RideFeedList';

function Home() {
	const [rides, setRides] = useState([]);

	useEffect(() => {
		fetch(`/api/rides`)
			.then((res) => res.json())
			.then((data) => setRides(data));
	}, []);

	return (
		<div>
			<h1>Home Here</h1>
			<RideFeedList rides={rides} />
		</div>
	);
}

export default Home;
