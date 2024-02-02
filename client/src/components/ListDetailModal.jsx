import { NavLink } from 'react-router-dom';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

function ListDetailModal(props) {
	const [route, setRoute] = useState(null);
	const [distance, setDistance] = useState('');
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
									Total Drives in Lifty:{' '}
									{props.ride.driver.rides_as_driver.length}
								</div>
							</div>
						</div>
						<p>Meet At: {props.ride.lot.address}</p>
						<p>Resort: {props.ride.resort.resort_name}</p>
						<p>
							Passenger Spots: {props.ride.passengers.length} /{' '}
							{props.ride.capacity}
						</p>
						<p>Distance: {distance}</p>
						<p>Duration: {duration}</p>
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
