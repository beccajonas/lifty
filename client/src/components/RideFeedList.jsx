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
			<div>
				<h1>List view</h1>
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
			</div>
		</>
	);
}

export default RideFeedList;
