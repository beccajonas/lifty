import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	RouterProvider,
	Route,
	useNavigate,
	Link,
} from 'react-router-dom';
import CollectiveImpactPage from './pages/CollectiveImpactPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import NavBar from './components/NavBar';
import MyStatsPage from './pages/MyStatsPage';
import Home from './pages/Home';
import About from './pages/About';

function App() {
	const [user, setUser] = useState(null);
	const [returningUser, setReturningUser] = useState(true);

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
				.then((res) => res.json())
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
					element={<Home />}
				/>
				<Route
					path='/about'
					element={<About />}
				/>
				<Route
					path='/mystats'
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
						/>
					}
				/>
				<Route
					path='/profile/:id'
					element={<UserProfilePage />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
