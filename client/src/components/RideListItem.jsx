import { useState, useEffect } from 'react';
import ListDetailModal from './ListDetailModal';

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
					handleLeaveClick={handleLeaveClick}
					handleJoinClick={handleJoinClick}
					handleDetailClick={handleDetailClick}
					isUserBooked={isUserBooked}
					isUserDriver={isUserDriver}
				/>
			) : null}
			<a
				onClick={handleDetailClick}
				className='flex flex-col items-center bg-gray-200 border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-300'>
				<img
					className='object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg'
					src={ride.driver.profile_pic}
					alt=''
				/>
				<div className='flex flex-col justify-between p-4 leading-normal'>
					<img
						className='object-contain h-20 w-20 rounded-full'
						src={ride.resort.logo}
						alt=''
					/>
					<h3 className='mb-2 text-l font-bold tracking-tight text-gray-900'>
						{ride.lot.lot_name} Park & Ride
					</h3>
					<p>
						Driver: {ride.driver.first_name} {ride.driver.last_name}
					</p>
				</div>
			</a>
		</>
	);
}

export default RideListItem;
