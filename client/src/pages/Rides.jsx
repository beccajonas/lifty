import { useState, useEffect } from 'react';
import RideFeedList from '../components/RideFeedList';
import RideForm from '../components/RideForm';
import { NavLink } from 'react-router-dom';

function Rides({ errorMessage, setErrorMessage, user, message, setMessage }) {
	const [rides, setRides] = useState([]);
	const [listView, setListView] = useState(true);
	const [bookRide, setBookRide] = useState(null);
	const [leftRide, setLeftRide] = useState(null);

	useEffect(() => {
		fetch(`/api/rides`)
			.then((res) => res.json())
			.then((data) => setRides(data));
	}, [bookRide, leftRide]);

	function handleLeaveRide(rideId) {
		fetch(`/api/rides/${rideId}/remove_passenger/${user.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to leave ride: ${res.status}`);
				}
				console.log('Successfully left ride.');
				setLeftRide(true);
				console.log(
					`In book ride: bookRide = ${bookRide} | leftRide = ${leftRide}`
				);
			})
			.catch((error) => console.error('Error:', error));
	}

	function handleBookRide(rideId) {
		fetch(`/api/rides/${rideId}/add_passengers`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: user.id }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setBookRide(true);
				console.log(
					`In book ride: bookRide = ${bookRide} | leftRide = ${leftRide}`
				);
			})
			.catch((error) => console.error('Error:', error));
	}

	return (
		<div>
			<h1>Rides Here</h1>
			<NavLink
				to='/add-ride'
				type='button'
				className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'>
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
			{listView ? (
				<RideFeedList
					rides={rides}
					bookRide={bookRide}
					handleBookRide={handleBookRide}
					user={user}
					handleLeaveRide={handleLeaveRide}
				/>
			) : (
				<h1>Map view goes here</h1>
			)}
		</div>
	);
}

export default Rides;
