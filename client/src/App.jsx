import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	RouterProvider,
	Route,
	useNavigate,
	Link,
	Navigate,
} from 'react-router-dom';
import CollectiveImpactPage from './pages/CollectiveImpactPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import NavBar from './components/NavBar';
import MyStatsPage from './pages/MyStatsPage';
import Rides from './pages/Rides';
import About from './pages/About';
import RideForm from './components/RideForm';

function App() {
	const [user, setUser] = useState(null);
	const [returningUser, setReturningUser] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [message, setMessage] = useState('');
	const [lots, setLots] = useState([]);
	const [resorts, setResorts] = useState([]);

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
					path='/rides'
					element={
						<Rides
							user={user}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							message={message}
							setMessage={setMessage}
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
					path='/profile/:id'
					element={<UserProfilePage />}
				/>
				<Route
					path='/add-ride'
					element={
						<RideForm
							lots={lots}
							resorts={resorts}
							user={user}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							message={message}
							setMessage={setMessage}
						/>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
