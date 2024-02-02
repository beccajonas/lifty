import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { useState, useEffect } from 'react';
import MapDetailModal from './MapDetailModal';

function RideFeedMap(props) {
	const [markers, setMarkers] = useState([]);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [selectedMarker, setSelectedMarker] = useState(null);

	useEffect(() => {
		const updatedMarkers = props.rides.map((ride) => ({
			position: { lat: ride.lot.latitude, lng: ride.lot.longitude },
			rideInfo: ride,
		}));

		setMarkers(updatedMarkers);
	}, [props.rides, props.bookRide]);

	function handleDetailClick(ride) {
		setShowDetailModal(true);
		setSelectedMarker(ride);
	}

	const mapStyles = {
		width: '50%',
		height: '50%',
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
		<>
			{showDetailModal ? (
				<MapDetailModal
					setShowDetailModal={setShowDetailModal}
					selectedMarker={selectedMarker}
				/>
			) : null}
			<Map
				google={props.google}
				zoom={10}
				style={mapStyles}
				initialCenter={{ lat: 40.7608, lng: -111.891 }}>
				{displayMarkers()}
			</Map>
		</>
	);
}

export default GoogleApiWrapper({
	apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
})(RideFeedMap);
