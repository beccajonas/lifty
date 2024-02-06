function GroupList({ group }) {
	return (
		<div className='m-2 w-full'>
			<div
				className={`flex items-center bg-blue-200 border border-gray-200 rounded-lg shadow hover:bg-blue-400 pr-3 pl-3`}>
				<div className='m-8 flex items-center'>
					<h1>{group.group_name}</h1>

					{group.members.map((member) => {
						return (
							<div className='m-8 flex flex-col items-center'>
								<p>
									{member.first_name} {member.last_name}
								</p>
								<img
									className='object-cover bg-cyan-800 w-40 h-40 border-2 border-gray-100'
									src={member.profile_pic}
									alt={`${member.first_name}'s profile pic`}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default GroupList;
