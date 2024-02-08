function UserProfilePage({ user }) {
<<<<<<< Updated upstream
=======
	console.log(user);
>>>>>>> Stashed changes
	const dateCreatedString = user.profile_created;
	const formattedDate = new Date(dateCreatedString).toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'numeric',
		}
	);

	return (
		<div className='bg-blue-300 h-screen'>
			<div className='bg-red-200 text-center'>My Profile</div>
			<div className='flex flex-row m-20'>
				<div className='basis-1/4 outline-dashed text-center'>
					<img
						className='object-contain h-50 w-50 ring-2 ring-gray-100 rounded-full'
						src={user.profile_pic}
						alt={user.first_name}
					/>
					<div className='bg-indigo-200 text-xs p-1 m-3 rounded-lg shadow'>
						Lifty Member Since: {formattedDate}
					</div>
				</div>
				<div className='basis-1/4 outline-dashed flex flex-col items-center justify-center text-center p-2'>
					<div>{user.bio}</div>
					<div className='bg-indigo-200 text-sm p-2 m-4 rounded-lg shadow'>
						📍 {user.area}
					</div>
					<div className='flex'>
						{user.snowboarder ? (
							<div className='bg-yellow-200 text-xl p-1 m-1 rounded-lg shadow'>
								🏂
							</div>
						) : null}
						{user.skier ? (
							<div className='bg-yellow-200 text-xl p-1 m-1 rounded-lg shadow'>
								🎿
							</div>
						) : null}
					</div>
				</div>
				<div className='basis-1/2 outline-dashed'>
					Rides with Lifty ={' '}
					{user.rides_as_driver.length + user.rides_as_passenger.length}
				</div>
			</div>
		</div>
	);
}

export default UserProfilePage;
