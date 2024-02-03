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
	const [listView, setListView] = useState(true);
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
				setLeftRide(true);
				setBookRide(!bookRide);
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
				console.log('booked ride!');
				console.log(data);
				setBookRide(true);
				setLeftRide(!leftRide);
			})
			.catch((error) => console.error('Error:', error));
	}

	return (
		<div>
			<div>
				<p style={{ color: '#38a169', marginTop: '1rem' }}>{message}</p>
				<button
					onClick={() => setShowModal(true)}
					type='button'
					data-modal-target='crud-modal'
					data-modal-toggle='crud-modal'
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
				<button
					className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
					onClick={() => setListView(true)}>
					List View
				</button>
				<button
					className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
					onClick={() => setListView(false)}>
					Map View
				</button>
			</div>

			{listView ? (
				<div className='grid m-4 max-w-2xl'>
					<RideFeedList
						rides={rides}
						bookRide={bookRide}
						handleBookRide={handleBookRide}
						user={user}
						handleLeaveRide={handleLeaveRide}
					/>
				</div>
			) : (
				<div>
					<RideFeedMap
						user={user}
						rides={rides}
						bookRide={bookRide}
						handleLeaveRide={handleLeaveRide}
						handleBookRide={handleBookRide}
					/>
				</div>
			)}
		</div>
	);
}

export default Rides;
