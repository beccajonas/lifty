import { useEffect, useState } from 'react';
import UserProfileCarousel from '../components/UserProfileCarousel';
import header from '../../public/liftyheader.png';
import profilePic from '../../public/liftyprofilepic.png';

function UserProfilePage({ user }) {
	const [userProfileData, setUserProfileData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);

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
	}, [editMode]);

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

	function handleSaveSubmit() {
		setEditMode(false);
	}

	function handleEditMode() {
		console.log('editing!');
		setEditMode(true);
	}

	return (
		<div className='bg-blue-200'>
			<div className='flex justify-center bg-blue-200 pt-4'>
				<div className='text-xl pl-2 pr-2 text-center'>
					{userProfileData.first_name}'s Profile
					<div>
						{editMode ? (
							<button
								className='text-green-600 cursor-pointer text-sm font-medium py-1 px-2 rounded-md transition duration-200 hover:bg-green-200'
								onClick={handleSaveSubmit}>
								Save
							</button>
						) : (
							<button
								className='text-red-600 cursor-pointer text-sm font-medium py-1 px-2 rounded-md transition duration-200 hover:bg-red-200'
								onClick={handleEditMode}>
								Edit Profile
							</button>
						)}
					</div>
				</div>
			</div>
			<div className='flex flex-row ml-20 mr-20 mt-5 p-10 bg-gradient-to-r from-indigo-500 to-blue-300'>
				<div className='basis-1/4 flex flex-col text-center h-full mr-3'>
					{editMode ? (
						<form>
							<label
								class='block mb-2 text-white bg-red-400 rounded-lg border-2 p-1 text-sm border-red-800'
								for='file_input'>
								Upload New Profile Picture
							</label>
							<input
								class='block w-full text-sm text-white border-2 p-1 border-red-800 rounded-lg cursor-pointer bg-red-400 focus:outline-none'
								aria-describedby='file_input_help'
								id='file_input'
								type='file'
							/>
							<p
								class='mt-1 text-sm text-gray-500 dark:text-gray-300'
								id='file_input_help'></p>
						</form>
					) : (
						<img
							className='object-cover object-top h-60 w-full ring-2 ring-gray-200 rounded-lg'
							src={userProfileData.profile_pic || profilePic}
						/>
					)}
					<div className='bg-indigo-200 text-xs p-1 m-3 rounded-lg shadow'>
						Lifty Member Since: {formattedDate}
					</div>
					{editMode ? (
						<div className='bg-red-400 border-2 text-white border-red-800 text-xs ml-6 mr-6 rounded-lg shadow p-3'>
							<label
								for='message'
								class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
								Bio
							</label>
							<textarea
								id='message'
								rows='4'
								class='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
								placeholder='Write a bio'></textarea>
						</div>
					) : (
						<div className='bg-yellow-100 text-xs ml-6 mr-6 rounded-lg shadow p-3'>
							{userProfileData.bio}
						</div>
					)}
					{editMode ? (
						<div className='bg-red-400 border-2 mt-3 text-white border-red-800 text-xs ml-6 mr-6 rounded-lg shadow p-3'>
							<label
								for='message'
								class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
								City/Neighborhood
							</label>
							<textarea
								id='message'
								rows='1'
								class='block p-1 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
								placeholder='📍'></textarea>
						</div>
					) : (
						<div className='bg-yellow-100 text-xs ml-6 mr-6 mt-3 rounded-lg shadow p-2'>
							📍 {userProfileData.area}
						</div>
					)}
					<div className='flex justify-center mb-2'>
						{editMode ? (
							<div class='flex bg-red-400 border-2 mt-3 text-white border-red-800 text-xs ml-6 mr-6 rounded-lg shadow p-3'>
								<div class='flex items-center me-4'>
									<input
										id='inline-checkbox'
										type='checkbox'
										value=''
										class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 '
									/>
									<label
										for='inline-checkbox'
										class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
										🏂
									</label>
								</div>
								<div class='flex items-center me-4'>
									<input
										id='inline-2-checkbox'
										type='checkbox'
										value=''
										class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
									/>
									<label
										for='inline-2-checkbox'
										class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
										🎿
									</label>
								</div>
								<div class='flex items-center me-4'>
									<input
										checked
										id='inline-checked-checkbox'
										type='checkbox'
										value=''
										class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
									/>
									<label
										for='inline-checked-checkbox'
										class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
										Both
									</label>
								</div>
							</div>
						) : (
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
						)}
					</div>
				</div>
				<div className='basis-3/4 flex flex-col items-center h-100 justify-start text-center'>
					{editMode ? (
						<form>
							<label
								class='block mb-2 text-white bg-red-400 rounded-lg border-2 p-1 text-sm border-red-800'
								for='file_input'>
								Upload New Profile Picture
							</label>
							<input
								class='block w-full text-sm text-white border-2 p-1 border-red-800 rounded-lg cursor-pointer bg-red-400 focus:outline-none'
								aria-describedby='file_input_help'
								id='file_input'
								type='file'
							/>
							<p
								class='mt-1 text-sm text-gray-500 dark:text-gray-300'
								id='file_input_help'></p>
						</form>
					) : (
						<div
							className=' w-full relative ring-2 ring-gray-200 rounded-lg'
							style={{
								width: '100%', // Ensure the div stretches to the full width
								height: '160px', // Set the height of the div to match the image height
								overflow: 'hidden', // Hide any overflow content
								backgroundImage: `url(${
									userProfileData.cover_photo || header
								})`, // Set the background image

								backgroundPosition: `0px, 0px`,
								backgroundSize: 'cover', // Ensure the image covers the entire area of the div
								backgroundRepeat: 'no-repeat', // Prevent the image from repeating
							}}></div>
					)}
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
