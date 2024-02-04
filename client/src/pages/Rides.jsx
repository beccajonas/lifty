import { useState, useEffect } from 'react';
import RideFeedList from '../components/RideFeedList';
import RideFormModal from '../components/RideFormModal';
import RideFeedMap from '../components/RideFeedMap';

function Rides({
	errorMessage,
	setErrorMessage,
	user,
	message,
	setMessage,
	showModal,
	setShowModal,
	lots,
	resorts,
}) {
	const [rides, setRides] = useState([]);
	const [bookRide, setBookRide] = useState(null);
	const [leftRide, setLeftRide] = useState(null);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setErrorMessage('');
			setMessage('');
		}, 3000);
		return () => clearTimeout(timeoutId);
	}, [message]);

	useEffect(() => {
		fetch(`/api/rides?sortBy=date_time`)
			.then((res) => res.json())
			.then((data) => {
				const sortedRides = data.sort(
					(a, b) => new Date(a.date_time) - new Date(b.date_time)
				);
				setRides(sortedRides);
			});
	}, [bookRide, leftRide, showModal, message]);

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
				setLeftRide(true);
				setBookRide(!bookRide);
			})
			.catch((error) => console.error('Error:', error));
	}

	function handleBookRide(rideId, distanceString) {
		const match = distanceString.match(/\d+(\.\d+)?/);
		const distanceFloat = parseFloat(match[0]);

		fetch(`/api/rides/${rideId}/add_passengers`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: user.id }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log('booked ride!');
				console.log(data);
				setBookRide(true);
				setLeftRide(!leftRide);
			})
			.catch((error) => console.error('Error:', error));

		// Patch distance data
		fetch(`/api/rides/${rideId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ distance_traveled: distanceFloat }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log('edited ride!');
				console.log(data);
			})
			.catch((error) => console.error('Error:', error));
	}

	return (
		<div>
			<div className='flex justify-center m-4'>
				<p style={{ color: '#38a169', marginTop: '1rem' }}>{message}</p>
				<button
					onClick={() => setShowModal(true)}
					type='button'
					className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>
					Post A Ride
				</button>
				{showModal ? (
					<RideFormModal
						lots={lots}
						resorts={resorts}
						user={user}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
						message={message}
						setMessage={setMessage}
						showModal={showModal}
						setShowModal={setShowModal}
						setBookRide={setBookRide}
					/>
				) : null}
			</div>
			<div className='grid grid-cols-2 h-screen overflow-x-hidden'>
				<div className='outline-dotted h-screen overflow-y-auto'>
					<RideFeedList
						rides={rides}
						bookRide={bookRide}
						handleBookRide={handleBookRide}
						user={user}
						handleLeaveRide={handleLeaveRide}
					/>
				</div>
				<div className='outline-dotted h-screen overflow-y-auto'>
					<RideFeedMap
						user={user}
						rides={rides}
						bookRide={bookRide}
						handleLeaveRide={handleLeaveRide}
						handleBookRide={handleBookRide}
					/>
				</div>
			</div>
		</div>
	);
}
export default Rides;
