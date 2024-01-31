import RideListItem from './RideListItem';
function RideFeedList({ rides }) {
	console.log(rides);
	return (
		<>
			<div>
				<h1>List view</h1>
				{rides.map((ride) => (
					<RideListItem
						key={ride.id}
						ride={ride}
					/>
				))}
			</div>
		</>
	);
}

export default RideFeedList;
