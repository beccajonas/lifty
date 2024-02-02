import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { useState, useEffect } from 'react';

function RideFeedMap(props) {
	console.log(props);
	const [markers, setMarkers] = useState([]);

	useEffect(() => {
		// Update markers when 'rides' prop changes
		const updatedMarkers = props.rides.map((ride) => ({
			position: { lat: ride.lot.latitude, lng: ride.lot.longitude },
		}));

		setMarkers(updatedMarkers);
	}, [props.rides, props.bookRide]);

	const mapStyles = {
		width: '50%',
		height: '50%',
	};

	const displayMarkers = () => {
		return markers.map((marker) => (
			<Marker
				position={marker.position}
				onClick={() => console.log('click')}
			/>
		));
	};

	return (
		<Map
			google={props.google}
			zoom={10}
			style={mapStyles}
			initialCenter={{ lat: 40.7608, lng: -111.891 }}>
			{displayMarkers()}
		</Map>
	);
}

export default GoogleApiWrapper({
	apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
})(RideFeedMap);
