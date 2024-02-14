function CollectiveImpactPage({ allRides }) {
	console.log(allRides);

	let totalDistance = allRides.reduce((acc, ride) => {
		return acc + ride.distance_traveled;
	}, 0);

	console.log(totalDistance);

	let totalEmissionsSaved = allRides.reduce((acc, ride) => {
		return Math.round(acc + ride.emissions_saved);
	}, 0);

	console.log(totalEmissionsSaved);

	return (
		<div>
			<h1>Total Distance Traveled Using Lifty: {totalDistance} miles </h1>
			<h1>Total Emissions Saved: {totalEmissionsSaved} lbs of CO2 </h1>
		</div>
	);
}

export default CollectiveImpactPage;
