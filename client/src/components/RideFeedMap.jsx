import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { useState, useEffect } from 'react';
import MapDetailModal from './MapDetailModal';

function RideFeedMap(props) {
	const [markers, setMarkers] = useState([]);
	const [showMapDetailModal, setShowMapDetailModal] = useState(false);
	const [selectedMarker, setSelectedMarker] = useState(null);

	useEffect(() => {
		const existingPositions = new Set();
		const updatedMarkers = props.rides.map((ride) => {
			const newPosition = { lat: ride.lot.latitude, lng: ride.lot.longitude };

			// Check if a marker already exists at the new position
			if (existingPositions.has(JSON.stringify(newPosition))) {
				newPosition.lat += 0.001;
				newPosition.lng += 0.001;
			}

			// Add the new position to the set of existing positions
			existingPositions.add(JSON.stringify(newPosition));

			return {
				position: newPosition,
				rideInfo: ride,
			};
		});
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
		width: '100%',
		height: '100%',
		borderWidth: '2px',
		zIndex: '0px',
		overflowX: 'hidden',
		overflowY: 'hidden',
	};

	const containerStyle = {
		width: '43%',
		padding: '10px',
		marginTop: '6px',
		height: '95%',
		maxWidth: '800px',
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
		<div className='overflow-y-auto pl-10 pr-20 '>
			{showMapDetailModal ? (
				<MapDetailModal
					setShowMapDetailModal={setShowMapDetailModal}
					selectedMarker={selectedMarker}
					handleLeaveClick={handleLeaveClick}
					handleJoinClick={handleJoinClick}
					user={props.user}
					rides={props.rides}
				/>
			) : null}

			<Map
				google={props.google}
				zoom={10}
				style={mapStyles}
				containerStyle={containerStyle}
				initialCenter={{ lat: 40.7, lng: -111.891 }}>
				{displayMarkers()}
			</Map>
		</div>
	);
}

export default GoogleApiWrapper({
	apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
})(RideFeedMap);
