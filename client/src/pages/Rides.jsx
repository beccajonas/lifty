import { useState, useEffect } from 'react';
import RideFeedList from '../components/RideFeedList';
import RideForm from '../components/RideForm';
import { NavLink } from 'react-router-dom';

function Rides() {
	const [rides, setRides] = useState([]);
	const [listView, setListView] = useState(true);
	const [addRide, setAddRide] = useState(false);

	useEffect(() => {
		fetch(`/api/rides`)
			.then((res) => res.json())
			.then((data) => setRides(data));
	}, []);

	return (
		<div>
			<h1>Rides Here</h1>
			<NavLink
				to='/add-ride'
				type='button'
				className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'
				onClick={() => setAddRide(true)}>
				Post A Ride
			</NavLink>
			<div>
				<button
					className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'
					onClick={() => setListView(true)}>
					List View
				</button>
				<button
					className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'
					onClick={() => setListView(false)}>
					Map View
				</button>
			</div>
			{listView ? <RideFeedList rides={rides} /> : <h1>Map view goes here</h1>}
		</div>
	);
}

export default Rides;
