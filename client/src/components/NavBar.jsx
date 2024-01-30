import { NavLink } from 'react-router-dom';

function NavBar({ user, handleLogout }) {
	function handleLogoutClick() {
		handleLogout();
	}
	return (
		<nav>
			<NavLink to='/'>Home</NavLink>
			<NavLink to='/about'>About</NavLink>
			{user ? <NavLink to='/mystats'>My Stats</NavLink> : null}
			<NavLink to='/collectiveimpact'>Collective Impact</NavLink>
			{user ? (
				<NavLink
					to='/login'
					onClick={handleLogoutClick}>
					Logout
				</NavLink>
			) : (
				<NavLink to='/login'>Login</NavLink>
			)}
		</nav>
	);
}

export default NavBar;
