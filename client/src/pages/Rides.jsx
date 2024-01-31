import { useState, useEffect } from 'react';
import RideFeedList from '../components/RideFeedList';

function Rides() {
	const [rides, setRides] = useState([]);
	const [listView, setListView] = useState(true);

	useEffect(() => {
		fetch(`/api/rides`)
			.then((res) => res.json())
			.then((data) => setRides(data));
	}, []);

	return (
		<div>
			<h1>Rides Here</h1>
			<button onClick={() => setListView(true)}>List View</button>
			<button onClick={() => setListView(false)}>Map View</button>
			{listView ? <RideFeedList rides={rides} /> : <h1>Map view goes here</h1>}
		</div>
	);
}

export default Rides;
