import { useState, useEffect } from 'react';
import ListDetailModal from './ListDetailModal';
import MapDetailModal from './MapDetailModal';

function RideListItem({ ride, handleBookRide, user, handleLeaveRide }) {
	const [showListDetailModal, setShowListDetailModal] = useState(false);

	const isUserBooked = ride.passengers.some(
		(passenger) => passenger.id === user.id
	);

	const isUserDriver = ride.driver_id === user.id;

	function handleLeaveClick() {
		handleLeaveRide(ride.id);
	}

	function handleJoinClick() {
		handleBookRide(ride.id);
	}

	function handleDetailClick() {
		setShowListDetailModal(true);
	}
	return (
		<>
			{showListDetailModal ? (
				<ListDetailModal
					setShowListDetailModal={setShowListDetailModal}
					ride={ride}
				/>
			) : null}
			<div
				className='border border-solid border-black'
				onClick={handleDetailClick}>
				Start: {ride.lot.lot_name} | Resort: {ride.resort.resort_name} |
				Passenger Spots: {ride.passengers.length} / {ride.capacity}
			</div>
			{isUserDriver ? (
				<button className='text-white bg-green-700 hover:bg-green-800  font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
					View Your Ride
				</button>
			) : (
				<>
					{!isUserBooked ? (
						<button
							onClick={handleJoinClick}
							className='text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
							Join this ride
						</button>
					) : (
						<button
							onClick={handleLeaveClick}
							className='text-white bg-red-700 hover:bg-red-800  font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>
							Leave this ride
						</button>
					)}
				</>
			)}
		</>
	);
}

export default RideListItem;
