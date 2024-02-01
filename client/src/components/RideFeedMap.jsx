import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { useState, useEffect } from 'react';
function RideFeedMap(props) {
	useEffect(() => {
		// Log each ride when the component is mounted or when 'rides' prop changes
		props.rides.forEach((ride) => {
			console.log(ride);
		});
	}, [props.rides]);

	const mapStyles = {
		width: '50%',
		height: '50%',
	};
	return (
		<Map
			google={props.google}
			zoom={10}
			style={mapStyles}
			initialCenter={{ lat: 40.7608, lng: -111.891 }}
		/>
	);
}

export default GoogleApiWrapper({
	apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
})(RideFeedMap);
