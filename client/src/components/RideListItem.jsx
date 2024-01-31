function RideListItem({ ride, handleBookRide, user, handleLeaveRide }) {
	const isUserBooked = ride.passengers.some(
		(passenger) => passenger.id === user.id
	);

	function handleLeaveClick() {
		handleLeaveRide(ride.id);
	}

	function handleJoinClick() {
		handleBookRide(ride.id);
	}
	return (
		<>
			<div>
				{ride.id} | Start: {ride.lot.lot_name} | Resort:{' '}
				{ride.resort.resort_name} | Passenger Spots: {ride.passengers.length} /{' '}
				{ride.capacity}
			</div>
			{!isUserBooked ? (
				<button
					onClick={handleJoinClick}
					className="className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'">
					Join this ride
				</button>
			) : (
				<button
					onClick={handleLeaveClick}
					className="className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'">
					Leave this ride
				</button>
			)}
		</>
	);
}

export default RideListItem;
