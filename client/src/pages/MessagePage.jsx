import { useState, useEffect } from 'react';
import GroupList from '../components/GroupList';
import GroupMessageDisplay from '../components/GroupMessageDisplay';
import NoGroupDisplay from '../components/NoGroupsDisplay';

function MessagePage({ user, leftRide, bookRide }) {
	const [groups, setGroups] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [messageContent, setMessageContent] = useState('');
	const [isLoading, setIsLoading] = useState(true); // Loading state

	useEffect(() => {
		fetch(`/api/users/${user.id}/groups`)
			.then((res) => res.json())
			.then((data) => {
				setGroups(data);
				setIsLoading(false); // Mark loading as complete once data is fetched
			})
			.catch((error) => {
				console.error('Error fetching groups:', error);
				setIsLoading(false); // In case of error, loading is still complete
			});
	}, []);

	function handleMessageSubmit(groupId, messageContent) {
		fetch(`/api/groups/${groupId}/add_message_from/${user.id}`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({ content: messageContent }),
		})
			.then((res) => res.json())
			.then((data) => console.log(data));
	}

	return (
		<div>
			<div className='flex justify-center m-4'>
				<h1>Messages</h1>
			</div>
			<div className='grid grid-cols-2 gap-4 h-screen overflow-x-hidden pl-4 pr-4'>
				<div className='overflow-y-auto'>
					{isLoading ? (
						<div>Loading...</div> // Display loading message while fetching data
					) : groups.length < 1 ? (
						<NoGroupDisplay />
					) : (
						<div className='h-screen overflow-y-auto'>
							{groups.map((group) => (
								<GroupList
									key={group.id}
									group={group}
									user={user}
									leftRide={leftRide}
									bookRide={bookRide}
									onClick={() => setSelectedGroup(group)}
								/>
							))}
						</div>
					)}
				</div>
				<div className='h-screen overflow-y-auto'>
					{selectedGroup ? (
						<GroupMessageDisplay
							group={selectedGroup}
							user={user}
							setMessageContent={setMessageContent}
							messageContent={messageContent}
							handleMessageSubmit={handleMessageSubmit}
						/>
					) : groups.length === 0 ? (
						<div className='flex justify-center m-4 flex-col items-center text-center'>
							<div className='p-5 bg-indigo-200 rounded-sm'>
								Group messages for each Lifty ride you post or book will appear
								here!
							</div>
						</div>
					) : (
						<p>Select a message</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default MessagePage;
