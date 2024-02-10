import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import CollectiveImpactPage from './pages/CollectiveImpactPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import NavBar from './components/NavBar';
import Rides from './pages/Rides';
import About from './pages/About';
import Profile from './pages/Profile';
import MessagePage from './pages/MessagePage';
import SignupForm from './pages/SignupForm';

function App() {
	const [user, setUser] = useState(null);
	const [returningUser, setReturningUser] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [message, setMessage] = useState('');
	const [lots, setLots] = useState([]);
	const [resorts, setResorts] = useState([]);
	const [showModal, setShowModal] = useState(null);
	const [bookRide, setBookRide] = useState(null);
	const [leftRide, setLeftRide] = useState(null);
	const [deletedRide, setDeletedRide] = useState(null);
	const [bio, setBio] = useState('');
	const [area, setArea] = useState('');
	const [isSnowboarder, setIsSnowboarder] = useState(false);
	const [isSkier, setIsSkier] = useState(false);
	const [profileCreatedDate, setProfileCreatedDate] = useState(null);
	const [firstName, setFirstName] = useState('');
	const [profilePic, setProfilePic] = useState('');
	const [coverPhoto, setCoverPhoto] = useState('');
	const [distanceTraveled, setDistanceTraveled] = useState(null);
	const [ridesAsDriver, setRidesAsDriver] = useState([]);
	const [ridesAsPassenger, setRidesAsPassenger] = useState([]);
	const [emissionsSaved, setEmissionsSaved] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [groups, setGroups] = useState([]);

	useEffect(() => {
		fetch(`/api/check_session`).then((res) => {
			if (res.ok) {
				res.json().then((data) => {
					console.log('fetching user data');
					setUser(data);
					setUser(data);
					setBio(data.bio);
					setArea(data.area);
					setIsSnowboarder(data.snowboarder);
					setIsSkier(data.skier);
					setProfileCreatedDate(data.profile_created);
					setFirstName(data.first_name);
					setProfilePic(data.profile_pic);
					setCoverPhoto(data.cover_photo);
					setDistanceTraveled(data.total_distance_traveled);
					setRidesAsDriver(data.rides_as_driver);
					setRidesAsPassenger(data.rides_as_passenger);
					setEmissionsSaved(data.total_emissions_saved);
					setGroups(data.groups);
				});
			}
		});
	}, [setUser, editMode, bookRide, leftRide, showModal, deletedRide]);

	function handleLogin(email, password) {
		const userInfo = {
			email,
			password,
		};
		try {
			fetch(`/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userInfo),
			})
				.then((res) => {
					if (!res.ok) {
						return res.json().then((data) => {
							setErrorMessage(data.error);
							throw new Error(data.error);
						});
					}
					return res.json();
				})
				.then((data) => {
					setUser(data);
					setBio(data.bio);
					setArea(data.area);
					setIsSnowboarder(data.snowboarder);
					setIsSkier(data.skier);
					setProfileCreatedDate(data.profile_created);
					setFirstName(data.first_name);
					setProfilePic(data.profile_pic);
					setCoverPhoto(data.cover_photo);
					setDistanceTraveled(data.total_distance_traveled);
					setRidesAsDriver(data.rides_as_driver);
					setRidesAsPassenger(data.rides_as_passenger);
					setEmissionsSaved(data.total_emissions_saved);
					console.log(data.groups);
				});
		} catch (error) {
			console.log(error);
		}
	}

	function handleLogout() {
		try {
			fetch(`/api/logout`, {
				method: 'DELETE',
			})
				.then((res) => res.json())
				.then(setUser(null));
		} catch (error) {
			console.log(error);
		}
	}

	function handleSignup(
		newEmail,
		passwordOne,
		passwordTwo,
		newLastName,
		newFirstName
	) {
		console.log(
			`New Email: ${newEmail} | Password1: ${passwordOne} | Password2: ${passwordTwo}`
		);
		if (passwordOne !== passwordTwo) {
			setErrorMessage('Passwords do not match. Try again.');
			return;
		} else {
			const newUser = {
				email: newEmail,
				password: passwordOne,
				first_name: newFirstName,
				last_name: newLastName,
			};
			try {
				fetch(`/api/signup`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newUser),
				})
					.then((res) => {
						if (!res.ok) {
							return res.json().then((data) => {
								setErrorMessage(data.error);
								throw new Error(data.error);
							});
						}
						return res.json();
					})
					.then((data) => {
						console.log(data);
						setMessage('Sign up successful! Please Login.');
					})
					.catch((error) => {
						console.log(error);
						setErrorMessage(error.message);
					});
			} catch (error) {
				console.log(error);
				setErrorMessage(error);
			}
		}
	}

	function handleEditProfile(updatedData) {
		// Send a patch request to update the user data
		fetch(`/api/users/${user.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedData),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to update profile');
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				setEditMode(false);
			})
			.catch((error) => {
				console.error('Error updating profile:', error);
			});
	}

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

	function handleDeleteRide(rideId) {
		console.log('deleting ride..');

		fetch(`/api/users/${user.id}/rides/${rideId}`, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setDeletedRide(true);
				console.log(data);
			});
	}

	useEffect(() => {
		fetch(`/api/lots`).then((res) => {
			if (res.ok) {
				res.json().then((data) => setLots(data));
			}
		});
	}, []);

	useEffect(() => {
		fetch(`/api/resorts`).then((res) => {
			if (res.ok) {
				res.json().then((data) => setResorts(data));
			}
		});
	}, []);

	const dateCreatedString = profileCreatedDate; // Formatting date
	const formattedDate = new Date(dateCreatedString).toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'numeric',
		}
	);

	return (
		<Router>
			<div>
				<header>
					<NavBar
						user={user}
						handleLogout={handleLogout}
					/>
				</header>
			</div>
			<Routes>
				<Route
					path='/'
					element={user ? <Navigate to='/rides' /> : <Navigate to='/login' />}
				/>
				<Route
					path='/rides'
					element={
						<Rides
							user={user}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							message={message}
							setMessage={setMessage}
							showModal={showModal}
							setShowModal={setShowModal}
							lots={lots}
							resorts={resorts}
							setBookRide={setBookRide}
							bookRide={bookRide}
							leftRide={leftRide}
							setLeftRide={setLeftRide}
							handleDeleteRide={handleDeleteRide}
							setDeletedRide={setDeletedRide}
							deletedRide={deletedRide}
						/>
					}
				/>
				<Route
					path='/about'
					element={<About />}
				/>
				<Route
					path='/collectiveimpact'
					element={<CollectiveImpactPage />}
				/>
				<Route
					path='/login'
					element={
						<LoginPage
							handleLogin={handleLogin}
							returningUser={returningUser}
							setReturningUser={setReturningUser}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							message={message}
							setMessage={setMessage}
							user={user}
						/>
					}
				/>
				<Route
					path='/messages'
					element={
						<MessagePage
							user={user}
							bookRide={bookRide}
							leftRide={leftRide}
							onClick={() => setMessagePageOpen(true)}
							groups={groups}
							handleMessageSubmit={handleMessageSubmit}
						/>
					}
				/>
				<Route
					path='/myprofile'
					element={
						<UserProfilePage
							user={user}
							bio={bio}
							area={area}
							isSnowboarder={isSnowboarder}
							isSkier={isSkier}
							formattedDate={formattedDate}
							firstName={firstName}
							profilePic={profilePic}
							coverPhoto={coverPhoto}
							distanceTraveled={distanceTraveled}
							ridesAsDriver={ridesAsDriver}
							ridesAsPassenger={ridesAsPassenger}
							emissionsSaved={emissionsSaved}
							handleEditProfile={handleEditProfile}
							editMode={editMode}
							setEditMode={setEditMode}
						/>
					}
				/>
				<Route
					path='/profile/:id'
					element={<Profile />}
				/>
				<Route
					path='/signup'
					element={
						<SignupForm
							errorMessage={errorMessage}
							handleSignup={handleSignup}
							setErrorMessage={setErrorMessage}
							setMessage={setMessage}
							message={message}
						/>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
