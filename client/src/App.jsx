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
import MyStatsPage from './pages/MyStatsPage';
import Rides from './pages/Rides';
import About from './pages/About';
import RideFormModal from './components/RideFormModal';
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

	useEffect(() => {
		fetch(`/api/check_session`).then((res) => {
			if (res.ok) {
				res.json().then((data) => setUser(data));
			}
		});
	}, [setUser]);

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
				.then((data) => setUser(data));
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

	function handleSignup(newEmail, passwordOne, passwordTwo) {
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
						/>
					}
				/>
				<Route
					path='/about'
					element={<About />}
				/>
				<Route
					path='/mystats/:id'
					element={<MyStatsPage />}
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
					path='/myprofile/:id/messages'
					element={
						<MessagePage
							user={user}
							bookRide={bookRide}
							leftRide={leftRide}
							onClick={() => setMessagePageOpen(true)}
						/>
					}
				/>
				<Route
					path='/myprofile/:id'
					element={<UserProfilePage user={user} />}
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
