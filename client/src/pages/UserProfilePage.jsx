import UserProfileCarousel from '../components/UserProfileCarousel';
import header from '../../public/liftyheader.png';
import defaultProfilePic from '../../public/liftyprofilepic.png';
import { useState } from 'react';
function UserProfilePage({
	user,
	bio,
	area,
	isSnowboarder,
	isSkier,
	formattedDate,
	firstName,
	profilePic,
	coverPhoto,
	distanceTraveled,
	ridesAsDriver,
	ridesAsPassenger,
	emissionsSaved,
	editMode,
	setEditMode,
	handleEditProfile,
	snowData,
	beerData,
	treeData,
}) {
	const [newBio, setNewBio] = useState(bio);
	const [newArea, setNewArea] = useState(area);
	const [isUserSnowboarder, setIsUserSnowboarder] = useState(isSnowboarder);
	const [isUserSkier, setIsUserSkier] = useState(isSkier);

	function handleUpdateProfile(e) {
		e.preventDefault();
		// Check if the form data has been modified
		if (
			newBio !== bio ||
			newArea !== area ||
			isUserSnowboarder !== isSnowboarder ||
			isUserSkier !== isSkier
		) {
			// Prepare the data object to send to the server
			const updatedData = {
				bio: newBio,
				area: newArea,
				snowboarder: isUserSnowboarder,
				skier: isUserSkier,
			};
			handleEditProfile(updatedData);
		} else {
			// No changes detected, do not update the state
			console.log('No changes detected. Original values retained.');
			setEditMode(false);
		}
	}

	function handleEditMode() {
		setEditMode(true);
	}

	return (
		<div className='bg-blue-200'>
			<div className='flex justify-center bg-blue-200 pt-4'>
				<div className='text-xl pl-2 pr-2 text-center'>
					{firstName}'s Profile
					<div>
						{editMode ? (
							<button
								type='submit'
								className='text-green-600 cursor-pointer text-sm font-medium py-1 px-2 rounded-md transition duration-200 hover:bg-green-200'
								onClick={handleUpdateProfile}>
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
					<img
						className='object-cover object-top h-60 w-full ring-2 ring-gray-200 rounded-lg'
						src={profilePic || defaultProfilePic}
					/>

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
								placeholder='Write a bio'
								value={newBio}
								onChange={(e) => setNewBio(e.target.value)}></textarea>
						</div>
					) : (
						<div className='bg-yellow-100 text-xs ml-6 mr-6 rounded-lg shadow p-3'>
							{bio}
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
								placeholder='📍'
								value={newArea}
								onChange={(e) => setNewArea(e.target.value)}></textarea>
						</div>
					) : (
						<div className='bg-yellow-100 text-xs ml-6 mr-6 mt-3 rounded-lg shadow p-2'>
							📍 {area}
						</div>
					)}
					<div className='flex justify-center mb-2'>
						{editMode ? (
							<div class='flex bg-red-400 border-2 mt-3 text-white border-red-800 text-xs ml-6 mr-6 rounded-lg shadow p-3'>
								<div class='flex items-center me-4'>
									<input
										id='inline-checkbox'
										type='checkbox'
										checked={isUserSnowboarder}
										onChange={(e) => setIsUserSnowboarder(e.target.checked)}
										class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
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
										checked={isUserSkier}
										onChange={(e) => setIsUserSkier(e.target.checked)}
										class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
									/>
									<label
										for='inline-2-checkbox'
										class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
										⛷
									</label>
								</div>
							</div>
						) : (
							<div className='flex'>
								{isSnowboarder ? (
									<div className='bg-yellow-100 text-5xl mt-3 mr-3 rounded-lg shadow p-4'>
										🏂
									</div>
								) : null}
								{isSkier ? (
									<div className='bg-yellow-100 text-5xl mt-3 mr-3 rounded-lg shadow p-4'>
										⛷
									</div>
								) : null}
							</div>
						)}
					</div>
				</div>
				<div className='basis-3/4 flex flex-col items-center h-100 justify-start text-center'>
					<div
						className=' w-full relative ring-2 ring-gray-200 rounded-lg'
						style={{
							width: '100%', // Ensure the div stretches to the full width
							height: '160px', // Set the height of the div to match the image height
							overflow: 'hidden', // Hide any overflow content
							backgroundImage: `url(${coverPhoto || header})`, // Set the background image

							backgroundPosition: `0px, 0px`,
							backgroundSize: 'cover', // Ensure the image covers the entire area of the div
							backgroundRepeat: 'no-repeat', // Prevent the image from repeating
						}}></div>
					<div class='flex flex-col justify-center items-center w-full '>
						<div class='grid grid-cols-3 gap-20 pl-4 pr-4 mt-4 '>
							<div class='bg-gradient-to-r from-yellow-100 to-blue-200 ring-1 ring-gray-200 rounded-lg text-xs p-1 shadow'>
								Miles traveled with Lifty:
								<div className='text-xl'>{Math.round(distanceTraveled)}</div>
							</div>
							<div class='bg-gradient-to-t from-yellow-100 to-blue-200 ring-1 ring-gray-200  text-xs p-1 rounded-lg shadow'>
								Rides with Lifty:
								<div className='text-xl'>
									{ridesAsDriver.length + ridesAsPassenger.length}
								</div>
							</div>
							<div class='bg-gradient-to-l from-yellow-100 to-blue-200 ring-1 ring-gray-200  text-xs p-1 rounded-lg shadow'>
								Emissions Saved By Using Lifty:
								<div className='text-xl'>
									{Math.round(emissionsSaved)} lbs/Co2
								</div>
							</div>
						</div>
						<UserProfileCarousel
							firstName={firstName}
							snowData={snowData}
							beerData={beerData}
							treeData={treeData}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserProfilePage;
