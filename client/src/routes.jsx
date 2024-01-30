import { BrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import ErrorPage from './pages/ErrorPage';
import CollectiveImpactPage from './pages/CollectiveImpactPage';
import MyStatsPage from './pages/MyStatsPage';
import Home from './pages/Home';
import About from './pages/About';

const routes = [
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/about',
				element: <About />,
			},
			{
				path: '/mystats',
				element: <MyStatsPage />,
			},
			{
				path: '/collectiveimpact',
				element: <CollectiveImpactPage />,
			},
			{
				path: '/login',
				element: <LoginPage />,
			},
			{
				path: '/profile/:id',
				element: <UserProfilePage />,
			},
		],
	},
];

export default routes;
