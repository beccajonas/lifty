function RideListItem({ ride }) {
	return (
		<>
			<li>
				{ride.id} | Start: {ride.lot_id} | Resort: {ride.resort_id} | Passenger
				Spots: {ride.passengers.length} / {ride.capacity}
			</li>
			<button>Book</button>
		</>
	);
}

export default RideListItem;
