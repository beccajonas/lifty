import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { useState, useEffect } from 'react';
import MapDetailModal from './MapDetailModal';

function RideFeedMap(props) {
	const [markers, setMarkers] = useState([]);
	const [showMapDetailModal, setShowMapDetailModal] = useState(false);
	const [selectedMarker, setSelectedMarker] = useState(null);

	useEffect(() => {
		const updatedMarkers = props.rides.map((ride) => ({
			position: { lat: ride.lot.latitude, lng: ride.lot.longitude },
			rideInfo: ride,
		}));

		setMarkers(updatedMarkers);
	}, [props.rides, props.bookRide]);

	function handleDetailClick(ride) {
		setShowMapDetailModal(true);
		setSelectedMarker(ride);
	}

	function handleJoinClick(rideId) {
		props.handleBookRide(rideId);
	}

	function handleLeaveClick(rideId) {
		props.handleLeaveRide(rideId);
	}

	const mapStyles = {
		width: '70%',
		height: '60%',
		'border-width': '3px',
		'z-index': '0px',
		padding: '5px',
		margin: '5px',
	};

	const displayMarkers = () => {
		return markers.map((marker, index) => (
			<Marker
				key={index}
				position={marker.position}
				onClick={() => handleDetailClick(marker.rideInfo)}
			/>
		));
	};

	return (
		<div>
			{showMapDetailModal ? (
				<MapDetailModal
					setShowMapDetailModal={setShowMapDetailModal}
					selectedMarker={selectedMarker}
					handleBookRide={props.handleBookRide}
					handleLeaveRide={props.handleLeaveRide}
					handleLeaveClick={handleLeaveClick}
					handleJoinClick={handleJoinClick}
					user={props.user}
				/>
			) : null}
			<div className=''>
				<Map
					google={props.google}
					zoom={10}
					style={mapStyles}
					initialCenter={{ lat: 40.7, lng: -111.891 }}>
					{displayMarkers()}
				</Map>
			</div>
		</div>
	);
}

export default GoogleApiWrapper({
	apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
})(RideFeedMap);
