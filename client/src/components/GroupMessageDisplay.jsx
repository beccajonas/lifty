import { useState, useEffect } from 'react';
function GroupMessageDisplay({
	group,
	user,
	handleMessageSubmit,
	messageContent,
	setMessageContent,
}) {
	const [messageList, setMessageList] = useState([]);
	const [newMessage, setNewMessage] = useState(false);
	const otherMembers = group.members.filter((member) => member.id !== user.id);

	useEffect(() => {
		fetch(`/api/groups/${group.id}/messages`)
			.then((res) => res.json())
			.then((data) => {
				// Filter out messages from members who are no longer in the group
				const filteredMessages = data.filter((message) => {
					return group.members.some(
						(member) => member.id === message.sender_id
					);
				});
				setMessageList(filteredMessages);
				setNewMessage(false);
			})
			.catch((error) => {
				console.error('Error fetching messages:', error);
			});
	}, [group.id, newMessage]);

	function getSenderName(senderId) {
		const sender = group.members.find((member) => member.id === senderId);
		return sender ? `${sender.first_name} ${sender.last_name}` : '';
	}

	function handleSubmit(e) {
		e.preventDefault();
		handleMessageSubmit(group.id, messageContent);
		setMessageContent('');
		setNewMessage(true);
	}

	return (
		<div>
			{otherMembers.length === 0 ? (
				<h1 className='text-center mt-8'>No messages to show yet</h1>
			) : (
				<>
					<h1 className='text-center mt-8'>
						Group Message With:{' '}
						{otherMembers
							.map((member) => `${member.first_name} ${member.last_name}`)
							.join(', ')}
					</h1>
					<div className='message-container mt-4'>
						{messageList.map((message) => (
							<div
								key={message.id}
								className='bg-gray-100 p-3 rounded-lg mb-2'>
								<div className='text-sm text-gray-600 mb-1'>
									{message.sender_id === user.id
										? 'You'
										: getSenderName(message.sender_id)}
								</div>
								<div className='text-gray-800'>{message.content}</div>
							</div>
						))}
					</div>
					<div>
						<form onSubmit={handleSubmit}>
							<input
								type='text'
								placeholder='Enter your message and press ENTER'
								value={messageContent}
								onChange={(e) => setMessageContent(e.target.value)}
							/>
							<button>Send</button>
						</form>
					</div>
				</>
			)}
		</div>
	);
}

export default GroupMessageDisplay;
