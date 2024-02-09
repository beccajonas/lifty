import { NavLink } from 'react-router-dom';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import React from 'react';
import profilePic from '../../public/liftyprofilepic.png';

function ListDetailModal(props) {
	const [route, setRoute] = useState(null);
	const [duration, setDuration] = useState('');

	const origin = {
		lat: props.ride.lot.latitude,
		lng: props.ride.lot.longitude,
	};
	const destination = {
		lat: props.ride.resort.latitude,
		lng: props.ride.resort.longitude,
	};

	const directionsService = new window.google.maps.DirectionsService();

	useEffect(() => {
		calculateDistance();
	}, []);

	function calculateDistance() {
		const request = {
			origin: origin,
			destination: destination,
			travelMode: 'DRIVING',
		};

		directionsService.route(request, (result, status) => {
			if (status === 'OK') {
				setRoute(result);
				setDuration(result.routes[0].legs[0].duration.text);
			} else {
				console.error(`Error fetching directions: ${status}`);
			}
		});
	}
	return (
		<>
			<div className='fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-sm backdrop-brightness-50 '>
				<div className='relative p-4 w-9/12 h-4/6 overflow-hidden bg-blue-200 border-2 border-blue-300'>
					<div className='flex justify-between border-b border-blue-300 rounded-t-md mb-3 pb-3'>
						<h3 className='text-xl font-semibold text-gray-700'>
							Ride Details
						</h3>
						<button
							className='text-red-600 cursor-pointer text-sm font-medium py-2 px-4 rounded-md transition duration-200 hover:bg-red-200'
							onClick={() => props.setShowListDetailModal(false)}>
							Close
						</button>
					</div>
					<div className='mt-4 pl-20'>
						<div className='flex items-center gap-4 mt-1 mb-1'>
							<img
								className='object-cover w-20 h-20 rounded-full ring-2 ring-gray-300'
								src={props.ride.driver.profile_pic || profilePic}
								alt=''
							/>
							<div className='font-medium'>
								<div>
									<NavLink
										to={`/profile/${props.ride.driver.id}`}
										className='text-indigo-500 hover:text-indigo-700'>
										Driver: {props.ride.driver.first_name}{' '}
										{props.ride.driver.last_name}
									</NavLink>
								</div>
								<div className='text-sm text-gray-400'>
									Total Miles Traveled With Lifty:{' '}
								</div>
							</div>
						</div>
					</div>

					<div className='flex space-y-4'>
						{/* Left Column */}
						<div className='w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mt-4 pb-4'>
							<div className='space-y-4 w-full h-full pl-20'>
								<p className='font-sans'>Meet At: {props.ride.lot.lot_name}</p>
								<p>Resort: {props.ride.resort.resort_name}</p>

								<p>Distance: {props.ride.distance_traveled} miles</p>
								<p>Duration To/From: {duration}</p>

								<div className='flex items-center'>
									{props.ride.passengers.length > 0 ? (
										[
											<p key='label'>Riders: </p>,
											...props.ride.passengers.map((passenger, index) => (
												<React.Fragment key={passenger.id}>
													{index > 0 && (
														<>
															<span key={`separator-${index}`}> | </span>
															<span>&nbsp;</span>
														</>
													)}
													<NavLink to={`/profile/${passenger.id}`}>
														<p
															key={passenger.id}
															className='font-semibold text-indigo-500 hover:text-indigo-700'>
															<span>&nbsp;</span>
															{passenger.first_name} {passenger.last_name}
															<span>&nbsp;</span>
														</p>
													</NavLink>
												</React.Fragment>
											)),
										]
									) : (
										<p>No riders yet.</p>
									)}
								</div>

								{props.isUserDriver ? (
									<button className='text-white bg-green-700 font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2'>
										Your Ride!
									</button>
								) : (
									<>
										{!props.isUserBooked ? (
											<button
												onClick={props.handleJoinClick}
												className='text-white bg-indigo-700 hover:bg-indigo-900 font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2'>
												Join this ride
											</button>
										) : (
											<button
												onClick={props.handleLeaveClick}
												className='text-white bg-red-700 hover:bg-red-800 font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>
												Leave this ride
											</button>
										)}
									</>
								)}
							</div>
						</div>

						{/* Right Column - Map */}
						<div>
							<Map
								google={props.google}
								style={{ width: '45%', height: '50%', padding: '1em' }}>
								<Marker position={origin} />
								<Marker position={destination} />
								{route && <DirectionsRenderer directions={route} />}
							</Map>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default GoogleApiWrapper({
	apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
})(ListDetailModal);
