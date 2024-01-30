import RideListItem from './RideListItem';
function RideFeedList({ rides }) {
	console.log(rides);
	return (
		<>
			<ul>
				{rides.map((ride) => (
					<RideListItem
						key={ride.id}
						ride={ride}
					/>
				))}
			</ul>
		</>
	);
}

export default RideFeedList;
