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
		<div className='m-3 overflow-y-auto rounded-lg ring-2 ring-indigo-400 bg-indigo-50 h-5/6'>
			{otherMembers.length === 0 ? (
				<div className='text-center bg-indigo-50 rounded-t-lg shadow p-2 text-sm'>
					No messages to show yet
				</div>
			) : (
				<>
					<div className='text-center overflow-y-auto bg-indigo-50 rounded-t-lg shadow p-2 text-sm'>
						Group Message With:{' '}
						{otherMembers
							.map((member) => `${member.first_name} ${member.last_name}`)
							.join(', ')}
					</div>
					<div className='p-4 bg-indigo-100 overflow-y-auto'>
						{messageList.map((message) => (
							<div
								key={message.id}
								className={`p-3 rounded-lg mb-2 ${
									message.sender_id === user.id
										? 'bg-blue-300'
										: 'bg-indigo-300'
								}`}>
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
						<form
							onSubmit={handleSubmit}
							className='flex'>
							<input
								type='text'
								className='mt-3 ml-4 mr-4 flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
								placeholder='Enter your message'
								value={messageContent}
								onChange={(e) => setMessageContent(e.target.value)}
							/>
							<button
								type='submit'
								className='inline-flex justify-center pt-3 pr-4 mt-3 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100'>
								<svg
									className='w-5 h-5 rotate-90 rtl:-rotate-90'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 18 18'>
									<path d='m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z' />
								</svg>
								<span className='sr-only'>Send message</span>
							</button>
						</form>
					</div>
				</>
			)}
		</div>
	);
}

export default GroupMessageDisplay;
