import { useState, useEffect } from 'react';
import GroupList from '../components/GroupList';
import GroupMessageDisplay from '../components/GroupMessageDisplay';
import NoGroupDisplay from '../components/NoGroupsDisplay';

function MessagePage({ user, leftRide, bookRide }) {
	const [groups, setGroups] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [messageContent, setMessageContent] = useState('');

	useEffect(() => {
		fetch(`/api/users/${user.id}/groups`)
			.then((res) => res.json())
			.then((data) => setGroups(data));
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
			<div className='grid grid-cols-2 h-screen overflow-x-hidden pl-4 pr-4'>
				<div className='outline-dotted h-screen overflow-y-auto'>
					{groups.length < 1 ? (
						<NoGroupDisplay />
					) : (
						groups.map((group) => (
							<GroupList
								key={group.id}
								group={group}
								user={user}
								leftRide={leftRide}
								bookRide={bookRide}
								onClick={() => setSelectedGroup(group)}
							/>
						))
					)}
				</div>
				<div className='outline-dotted h-screen overflow-y-auto'>
					{selectedGroup ? (
						<GroupMessageDisplay
							group={selectedGroup}
							user={user}
							setMessageContent={setMessageContent}
							messageContent={messageContent}
							handleMessageSubmit={handleMessageSubmit}
						/>
					) : groups.length === 0 ? (
						<p>
							Your messages will display here when you have a ride with other
							Lifty users!
						</p>
					) : (
						<p>Select a message</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default MessagePage;
