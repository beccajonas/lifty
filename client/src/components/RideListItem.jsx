import { useState, useEffect } from 'react';
import { format } from 'date-fns';
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

	function handleJoinClick(distance) {
		handleBookRide(ride.id, distance);
	}

	function handleDetailClick() {
		setShowListDetailModal(true);
	}
	return (
		<>
			{showListDetailModal && (
				<ListDetailModal
					setShowListDetailModal={setShowListDetailModal}
					ride={ride}
					handleLeaveClick={handleLeaveClick}
					handleJoinClick={handleJoinClick}
					handleDetailClick={handleDetailClick}
					isUserBooked={isUserBooked}
					isUserDriver={isUserDriver}
				/>
			)}
			<div className='m-2 w-full'>
				<a onClick={handleDetailClick}>
					<div
						className={`flex items-center bg-${
							isUserBooked ? 'blue' : isUserDriver ? 'blue' : 'gray'
						}-200 border border-gray-200 rounded-lg shadow hover:bg-gray-300 pr-3 pl-3`}>
						<div className='m-8 flex items-center'>
							<img
								className='object-cover bg-cyan-800 w-40 h-40 bg-cyan'
								src={ride.driver.profile_pic}
								alt={ride.driver.name}
							/>
						</div>
						<div className='m-8 flex flex-col items-center'>
							<img
								className='object-contain h-20 w-24 ring-2 ring-gray-300 rounded-full'
								src={ride.resort.logo}
								alt={ride.resort.resort_name}
							/>
							<div className='mt-1'>
								{ride.roundtrip ? (
									<button className='text-white bg-purple-700 p-2 mt-3 text-xs rounded-full'>
										Round Trip
									</button>
								) : (
									<button className='text-white bg-yellow-500 p-2 mt-3 text-xs rounded-full'>
										One Way
									</button>
								)}
							</div>
						</div>
						<div>
							<p className='mb-2 tracking-tight text-gray-900'>
								{ride.lot.lot_name}
							</p>
							<p className='mb-2 tracking-tight text-gray-900'>
								Date:{' '}
								{new Date(ride.date_time).toLocaleString('en-US', {
									month: 'numeric',
									day: 'numeric',
									hour: 'numeric',
									minute: 'numeric',
									hour12: true,
								})}
							</p>
							<p className='mb-2 tracking-tight text-gray-900'>
								Seats left: {ride.capacity - ride.passengers.length}
							</p>
							{isUserDriver ? (
								<button className='text-white bg-green-500 p-2 text-xs rounded-full'>
									You're driving!
								</button>
							) : null}
							{isUserBooked ? (
								<button className='text-white bg-green-500 p-2 text-xs rounded-full'>
									You're riding!
								</button>
							) : null}
							{ride.capacity - ride.passengers.length === 0 && (
								<button className='text-white bg-red-500 p-2 m-2 text-xs rounded-full'>
									Ride full!
								</button>
							)}
						</div>
					</div>
				</a>
			</div>
		</>
	);
}

export default RideListItem;
