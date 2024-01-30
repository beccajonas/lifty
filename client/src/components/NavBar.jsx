import { NavLink } from 'react-router-dom';

const user = true;

function NavBar() {
	return (
		<nav>
			<NavLink to='/'>Home</NavLink>
			<NavLink to='/about'>About</NavLink>
			{user ? <NavLink to='/mystats'>My Stats</NavLink> : null}
			<NavLink to='/collectiveimpact'>Collective Impact</NavLink>
			{user ? (
				<NavLink to='/login'>Logout</NavLink>
			) : (
				<NavLink to='/login'>Login</NavLink>
			)}
		</nav>
	);
}

export default NavBar;
