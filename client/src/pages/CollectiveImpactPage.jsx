function CollectiveImpactPage({ allRides }) {
	console.log(allRides);

	let totalDistance = allRides.reduce((acc, ride) => {
		return Math.round(acc + ride.distance_traveled);
	}, 0);

	console.log(totalDistance);

	let totalEmissionsSaved = allRides.reduce((acc, ride) => {
		return Math.round(acc + ride.emissions_saved);
	}, 0);

	console.log(totalEmissionsSaved);

	return (
		<>
			<video
				autoPlay
				loop
				muted
				className='absolute inset-0 w-full h-full object-cover z-0'
				style={{ zIndex: '-1' }}>
				<source
					src='../../public/liftynotext.mp4'
					type='video/mp4'
				/>
				Your browser does not support the video tag.
			</video>
			<div className='relative z-10'></div>
			<div className='h-screen'>
				<div className='flex justify-center items-center m-4'></div>
				<div class='flex flex-col justify-center items-center w-full h-2/3 '>
					<div className='p-5 m-8 text-white bg-indigo-700 rounded-md text-5xl'>
						Togther we are making a difference.
					</div>
					<div class='grid grid-cols-2 gap-20 pl-4 pr-4 mt-4'>
						<div class='bg-gradient-to-r from-blue-50 to-indigo-300 ring-4 ring-gray-200 rounded-lg text-xl p-10 shadow text-center'>
							Total Distance Traveled By Lifty Users:
							<div className='text-4xl'>{totalDistance} miles</div>
						</div>
						<div class='bg-gradient-to-l from-blue-50 to-indigo-300 ring-4 ring-gray-200 rounded-lg text-xl p-10 shadow text-center'>
							Total Emissions Saved By Lifty Users:
							<div className='text-4xl'>{totalEmissionsSaved} lbs/C02</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CollectiveImpactPage;
