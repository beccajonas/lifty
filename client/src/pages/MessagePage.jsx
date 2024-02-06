import { useState, useEffect } from 'react';
import GroupList from '../components/GroupList';
import GroupMessageDisplay from '../components/GroupMessageDisplay';

function MessagePage({ user }) {
	const [groups, setGroups] = useState([]);
	console.log(groups);

	useEffect(() => {
		fetch(`/api/users/${user.id}/groups`)
			.then((res) => res.json())
			.then((data) => setGroups(data));
	}, []);
	return (
		<div>
			<div className='flex justify-center m-4'></div>
			<div className='grid grid-cols-2 h-screen overflow-x-hidden'>
				<div className='outline-dotted h-screen overflow-y-auto'>
					{groups.map((group) => (
						<GroupList
							group={group}
							key={group.id}
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
