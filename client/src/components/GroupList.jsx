import { useState, useEffect } from 'react';

function GroupList({ group, onClick }) {
	const [showGroupMessage, setShowGroupMessage] = useState(false);
	const [rideDateTime, setRideDateTime] = useState([]);
	const [rideResort, setRideResort] = useState([]);
	const [rideLot, setRideLot] = useState([]);

	function handleGroupClick() {
		setShowGroupMessage(true);
		onClick();
	}

	useEffect(() => {
		fetch(`/api/rides/${group.id}`)
			.then((res) => res.json())
			.then((data) => {
				setRideDateTime(data.date_time);
				setRideResort(data.resort.resort_name);
				setRideLot(data.lot.address);
			});
	}, [group.id]);

	function formatDateTime(dateTimeString) {
		const dateTime = new Date(dateTimeString);
		const options = {
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		};
		return dateTime.toLocaleString('en-US', options);
	}

	return (
		<div className='m-2 w-full'>
			<h1>
				Group Message for Ride On: {formatDateTime(rideDateTime)} to{' '}
				{rideResort} from {rideLot}
			</h1>
			<div
				onClick={handleGroupClick}
				className={`flex items-center bg-blue-200 border border-gray-200 rounded-lg shadow hover:bg-blue-400 pr-3 pl-3`}>
				<div className='m-1 flex items-center'>
					{group.members.length >= 2 ? (
						group.members.map((member) => (
							<div
								className='m-8 flex flex-col items-center'
								key={member.id}>
								<p>
									{member.first_name} {member.last_name}
								</p>
								<img
									className='object-cover bg-cyan-800 w-20 h-20 border-2 border-gray-100'
									src={member.profile_pic}
									alt={`${member.first_name}'s profile pic`}
								/>
							</div>
						))
					) : (
						<div className='m-8 flex flex-col items-center'>
							<p>No riders yet</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default GroupList;
