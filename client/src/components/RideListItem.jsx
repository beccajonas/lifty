function RideListItem({ ride }) {
	return (
		<>
			<div>
				{ride.id} | Start: {ride.lot_id} | Resort: {ride.resort_id} | Passenger
				Spots: {ride.passengers.length} / {ride.capacity}
			</div>
			<button>Book</button>
		</>
	);
}

export default RideListItem;
