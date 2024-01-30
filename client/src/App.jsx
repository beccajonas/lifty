import { useState } from 'react';
import CollectiveImpactPage from './pages/CollectiveImpactPage';
import LoginPage from './pages/LoginPage';
import MyStatsPage from './pages/MyStatsPage';
import UserProfilePage from './pages/UserProfilePage';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';

function App() {
	return (
		<div>
			<header>
				<NavBar />
			</header>
			<Outlet />
		</div>
	);
}

export default App;
