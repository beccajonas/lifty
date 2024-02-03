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
			<div className='m-2 w-full'>
				<a onClick={handleDetailClick}>
					<div className='flex flex-col items-center bg-gray-200 border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-300 pr-3'>
						<img
							className='object-cover bg-cyan-800 w-40 h-40 bg-cyan'
							src={ride.driver.profile_pic}
							alt={ride.driver.name}
						/>
						<div
							className='m-8 w-20 h-24
							'>
							<img
								className='object-contain h-20 w-24 ring-2 ring-gray-300 rounded-full'
								src={ride.resort.logo}
								alt={ride.resort.resort_name}
							/>
							<p className='mb-2 tracking-tight text-gray-900'>Round trip</p>
						</div>
						<div>
							<p className='mb-2 tracking-tight text-gray-900'>
								{ride.lot.lot_name}
							</p>
							<p className='mb-2 tracking-tight text-gray-900'>Date:</p>
							<p className='mb-2 tracking-tight text-gray-900'>Time:</p>
							<p className='mb-2 tracking-tight text-gray-900'>
								Seats left: {ride.capacity - ride.passengers.length}
							</p>
							{ride.capacity - ride.passengers.length === 0 ? (
								<p className='font-bold text-red-500'>Ride full!</p>
							) : null}
						</div>
					</div>
				</a>
			</div>
		</>
	);
}

export default RideListItem;
