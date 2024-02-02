import { NavLink } from 'react-router-dom';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

function ListDetailModal(props) {
	const [route, setRoute] = useState(null);
	const [distance, setDistance] = useState('');
	const [duration, setDuration] = useState('');
	console.log(props.ride.passengers);
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
				setDistance(result.routes[0].legs[0].distance.text);
				setDuration(result.routes[0].legs[0].duration.text);
			} else {
				console.error(`Error fetching directions: ${status}`);
			}
		});
	}

	return (
		<>
			<div
				style={{
					position: 'fixed',
					top: 0,
					right: 0,
					left: 0,
					bottom: 0,
					zIndex: 50,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<div
					style={{
						position: 'relative',
						padding: '1rem',
						width: '80%',
						height: '80%',
						overflowY: 'auto',
						overflowX: 'hidden',
						background: '#fff',
						borderRadius: '0.375rem',
						boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
						border: '1px solid #e5e7eb',
					}}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							padding: '1rem',
							borderBottom: '1px solid #d1d5db',
							borderRadius: '0.375rem 0.375rem 0 0',
						}}>
						<h3
							style={{
								fontSize: '1rem',
								fontWeight: '600',
								color: '#1a202c',
							}}>
							Ride Details
						</h3>
						<button
							style={{
								color: '#e53e3e',
								cursor: 'pointer',
								fontSize: '0.875rem',
								fontWeight: '500',
								padding: '0.2rem 1rem',
							}}
							onClick={() => props.setShowListDetailModal(false)}>
							Close
						</button>
					</div>
					<div>
						<div className='flex items-center mt-1 mb-1 gap-4'>
							<img
								className='w-10  rounded-full ring-2 ring-gray-300'
								src={props.ride.driver.profile_pic}
								alt=''
							/>
							<div className='font-medium'>
								<div>
									<NavLink to={`/profile/${props.ride.driver.id}`}>
										Driver: {props.ride.driver.first_name}{' '}
										{props.ride.driver.last_name}
									</NavLink>
								</div>
								<div className='text-sm text-gray-500 dark:text-gray-400'>
									Total Miles Traveled With Lifty:{' '}
								</div>
							</div>
						</div>
						<p>Meet At: {props.ride.lot.address}</p>
						<p>Resort: {props.ride.resort.resort_name}</p>
						<p>
							Passenger Spots: {props.ride.passengers.length} /{' '}
							{props.ride.capacity}
						</p>

						{props.ride.passengers.length > 0 && (
							<div>
								<p className='font-semibold text-indigo-500'>
									Riders:{' '}
									{props.ride.passengers.map((passenger) => (
										<NavLink
											to={`/profile/${passenger.id}`}
											key={passenger.id}>
											{passenger.first_name} {passenger.last_name}
										</NavLink>
									))}
								</p>
							</div>
						)}

						<p>Distance: {distance}</p>
						<p>Duration: {duration}</p>

						{props.isUserDriver ? (
							<button className='text-white bg-green-700 font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2'>
								Your Ride!
							</button>
						) : (
							<>
								{!props.isUserBooked ? (
									<button
										onClick={props.handleJoinClick}
										className='text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
										Join this ride
									</button>
								) : (
									<button
										onClick={props.handleLeaveClick}
										className='text-white bg-red-700 hover:bg-red-800  font-medium rounded-full text-sm px-3 py-1  text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>
										Leave this ride
									</button>
								)}
							</>
						)}
						<Map
							google={props.google}
							zoom={13}
							style={{ width: '90%', height: '60%' }}>
							<Marker position={origin} />
							<Marker position={destination} />
							{route && <DirectionsRenderer directions={route} />}
						</Map>
					</div>
				</div>
			</div>
		</>
	);
}

export default GoogleApiWrapper({
	apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
})(ListDetailModal);
