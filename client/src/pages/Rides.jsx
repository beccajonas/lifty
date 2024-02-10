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
	bookRide,
	setBookRide,
	leftRide,
	setLeftRide,
	handleDeleteRide,
	setDeletedRide,
	deletedRide,
}) {
	const [rides, setRides] = useState([]);
	const [loading, setLoading] = useState(true); // Introducing loading state

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setErrorMessage('');
			setMessage('');
		}, 3000);
		return () => clearTimeout(timeoutId);
	}, [message]);

	useEffect(() => {
		setLoading(true); // Set loading state to true before fetch
		fetch(`/api/rides?sortBy=date_time`)
			.then((res) => res.json())
			.then((data) => {
				const sortedRides = data.sort(
					(a, b) => new Date(a.date_time) - new Date(b.date_time)
				);
				setRides(sortedRides);
				setLoading(false); // Set loading state to false after fetch
			});
	}, [bookRide, leftRide, showModal, message, deletedRide]);

	function handleLeaveRide(rideId) {
		console.log(rideId);
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
				res.json();
				setLeftRide(true);
				setBookRide(false);
			})
			.then((data) => console.log(data))

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
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to leave ride: ${res.status}`);
				}
				res.json();
				setBookRide(true);
				setLeftRide(false);
			})
			.then((data) => console.log(data))

			.catch((error) => console.error('Error:', error));
	}

	return (
		<div className='h-80vh'>
			<div className='flex justify-center m-4'>
				<button
					onClick={() => setShowModal(true)}
					type='button'
					className=' py-2 px-4 text-white bg-indigo-700 rounded-md cursor-pointer transition duration-200 hover:bg-gray-700'>
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
			<div className='grid grid-cols-2 h-screen overflow-x-hidden pl-10 pr-10'>
				<div className='overflow-y-auto pr-20 pl-10'>
					<div className='relative'>
						<p className='absolute z-50 text-green-900 bg-green-200'>
							{message}
						</p>
					</div>
					{loading ? (
						<div>Loading...</div> // Display loading indicator
					) : (
						<RideFeedList
							rides={rides}
							bookRide={bookRide}
							handleBookRide={handleBookRide}
							user={user}
							handleLeaveRide={handleLeaveRide}
							handleDeleteRide={handleDeleteRide}
							setDeletedRide={setDeletedRide}
						/>
					)}
				</div>
				<RideFeedMap
					user={user}
					rides={rides}
					bookRide={bookRide}
					handleLeaveRide={handleLeaveRide}
					handleBookRide={handleBookRide}
				/>
			</div>
		</div>
	);
}
export default Rides;
