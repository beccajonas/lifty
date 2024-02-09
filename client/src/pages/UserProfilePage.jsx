import { useEffect, useState } from 'react';
import UserProfileCarousel from '../components/UserProfileCarousel';

function UserProfilePage({ user }) {
	const [userProfileData, setUserProfileData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(`/api/users/${user.id}`)
			.then((res) => res.json())
			.then((data) => {
				setUserProfileData(data);
				setIsLoading(false); // Once data is fetched, loading is complete
			})
			.catch((error) => {
				console.error('Error fetching user profile data:', error);
				setIsLoading(false); // In case of error, loading is still complete
			});
	}, []);

	console.log(userProfileData);

	if (isLoading) {
		return <div>Loading...</div>; // Display loading message while fetching data
	}

	if (!userProfileData) {
		return <div>Error: Unable to fetch user profile data.</div>; // Display error if data is not available
	}

	const dateCreatedString = userProfileData.profile_created; // Formatting date
	const formattedDate = new Date(dateCreatedString).toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'numeric',
		}
	);

	return (
		<div className='bg-blue-200'>
			<div className='flex justify-center bg-blue-200 pt-4'>
				<div className='text-xl pl-2 pr-2'>
					{userProfileData.first_name}'s Profile
				</div>
			</div>
			<div className='flex flex-row ml-20 mr-20 mt-5 p-10 bg-gradient-to-r from-indigo-500 to-blue-300'>
				<div className='basis-1/4 flex flex-col text-center h-full mr-3'>
					<img
						className='object-cover object-top h-60 w-full ring-2 ring-gray-200 rounded-lg'
						src={userProfileData.profile_pic}
						alt={userProfileData.first_name}
					/>
					<div className='bg-indigo-200 text-xs p-1 m-3 rounded-lg shadow'>
						Lifty Member Since: {formattedDate}
					</div>
					<div className='bg-yellow-100 text-xs ml-6 mr-6 rounded-lg shadow p-3'>
						{userProfileData.bio}
					</div>
					<div className='bg-yellow-100 text-xs ml-6 mr-6 mt-3 rounded-lg shadow p-2'>
						📍 {userProfileData.area}
					</div>
					<div className='flex justify-center mb-2'>
						<div className='flex'>
							{userProfileData.snowboarder ? (
								<div className='bg-yellow-100 text-5xl mt-3 mr-3 rounded-lg shadow p-4'>
									🏂
								</div>
							) : null}
							{userProfileData.skier ? (
								<div className='bg-yellow-100 text-4xl mt-3 mr-3 rounded-lg shadow p-4'>
									🎿
								</div>
							) : null}
						</div>
					</div>
				</div>
				<div className='basis-3/4 flex flex-col items-center h-100 justify-start text-center'>
					<div
						className=' w-full relative ring-2 ring-gray-200 rounded-lg'
						style={{
							width: '100%', // Ensure the div stretches to the full width
							height: '160px', // Set the height of the div to match the image height
							overflow: 'hidden', // Hide any overflow content
							backgroundImage: `url(${userProfileData.cover_photo})`,
							backgroundPosition: `0px, 0px`,
							backgroundSize: 'cover', // Ensure the image covers the entire area of the div
							backgroundRepeat: 'no-repeat', // Prevent the image from repeating
						}}></div>
					<div class='flex flex-col justify-center items-center w-full '>
						<div class='grid grid-cols-3 gap-20 pl-4 pr-4 mt-4 '>
							<div class='bg-gradient-to-r from-yellow-100 to-blue-200 ring-1 ring-gray-200 rounded-lg text-xs p-1 shadow'>
								Miles traveled with Lifty:
								<div className='text-xl'>
									{Math.round(userProfileData.total_distance_traveled)}
								</div>
							</div>
							<div class='bg-gradient-to-t from-yellow-100 to-blue-200 ring-1 ring-gray-200  text-xs p-1 rounded-lg shadow'>
								Rides with Lifty:
								<div className='text-xl'>
									{userProfileData.rides_as_driver.length +
										userProfileData.rides_as_passenger.length}
								</div>
							</div>
							<div class='bg-gradient-to-l from-yellow-100 to-blue-200 ring-1 ring-gray-200  text-xs p-1 rounded-lg shadow'>
								Emissions Saved By Using Lifty:
								<div className='text-xl'>
									{Math.round(userProfileData.total_emissions_saved)} lbs/Co2
								</div>
							</div>
						</div>
						<UserProfileCarousel userProfileData={userProfileData} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserProfilePage;
