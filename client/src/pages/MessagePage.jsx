import { useState, useEffect } from 'react';
import GroupList from '../components/GroupList';
import GroupMessageDisplay from '../components/GroupMessageDisplay';

function MessagePage({ user, leftRide, bookRide }) {
	const [groups, setGroups] = useState([]);
	const [rideDateTime, setRideDateTime] = useState([]);

	useEffect(() => {
		// Fetch groups data
		fetch(`/api/users/${user.id}/groups`)
			.then((res) => res.json())
			.then((data) => setGroups(data));
	}, [user.id]); // Fetch groups only once when user id changes

	useEffect(() => {
		// Fetch all rides data
		fetch(`/api/rides`)
			.then((res) => res.json())
			.then((ridesData) => {
				// Filter rides data based on group ids
				const filteredRides = ridesData.filter((ride) =>
					groups.some((group) => group.id === ride.id)
				);
				// Extract date_time from filtered rides
				const rideDateTimes = filteredRides.map((ride) => ride.date_time);
				setRideDateTime(rideDateTimes);
			});
	}, [groups]); // Fetch rides and filter based on groups

	return (
		<div>
			<div className='flex justify-center m-4'>
				<h1>Messages</h1>
			</div>
			<div className='grid grid-cols-2 h-screen overflow-x-hidden'>
				<div className='outline-dotted h-screen overflow-y-auto'>
					{groups.map((group, index) => (
						<GroupList
							group={group}
							key={group.id}
							user={user}
							leftRide={leftRide}
							bookRide={bookRide}
							rideDateTime={rideDateTime[index]} // Pass rideDateTime as a prop
						/>
					))}
				</div>
				<div className='outline-dotted h-screen overflow-y-auto'>
					<GroupMessageDisplay />
				</div>
			</div>
		</div>
	);
}

export default MessagePage;
