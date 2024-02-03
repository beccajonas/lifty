import RideListItem from './RideListItem';

function RideFeedList({
	rides,
	bookRide,
	setBookRide,
	handleBookRide,
	user,
	handleLeaveRide,
	isUserBooked,
}) {
	return (
		<>
			{rides.map((ride) => (
				<RideListItem
					key={ride.id}
					ride={ride}
					bookRide={bookRide}
					setBookRide={setBookRide}
					handleBookRide={handleBookRide}
					user={user}
					handleLeaveRide={handleLeaveRide}
					isUserBooked={isUserBooked}
				/>
			))}
		</>
	);
}

export default RideFeedList;
