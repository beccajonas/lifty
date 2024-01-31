// Navbar.js

import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import logo from '../../public/logo.png';

const Navbar = ({ user, handleLogout }) => {
	const [openAvatarDropdown, setOpenAvatarDropdown] = useState(false);

	const toggleAvatarDropdown = () => {
		setOpenAvatarDropdown(!openAvatarDropdown);
	};

	function handleLogoutClick() {
		handleLogout();
	}

	const navList = () => {
		return (
			<>
				{user ? (
					<NavLink
						to='/rides'
						className={({ isActive, isPending }) =>
							isPending ? 'pending' : isActive ? 'text-blue-900' : ''
						}>
						Rides
					</NavLink>
				) : null}
				<NavLink
					to='/about'
					className={({ isActive, isPending }) =>
						isPending ? 'pending' : isActive ? 'text-blue-900' : ''
					}>
					About
				</NavLink>
				<NavLink
					to='/collectiveimpact'
					className={({ isActive, isPending }) =>
						isPending ? 'pending' : isActive ? 'text-blue-900' : ''
					}>
					Collective Impact
				</NavLink>
				{user ? null : (
					<NavLink
						to='/login'
						className={({ isActive, isPending }) =>
							isPending ? 'pending' : isActive ? 'text-blue-900' : ''
						}>
						Login
					</NavLink>
				)}
			</>
		);
	};

	return (
		<header className='bg-slate-200 border-gray-200 font-sans'>
			<div className='container mx-auto py-3 px-2 md:flex md:items-center md:justify-between'>
				<div className='flex items-center justify-between'>
					<a className='text-2xl font-semibold text-gray-800'>
						<img
							className='object-contain h-20'
							src={logo}
							alt=''
						/>
					</a>
				</div>
				<nav className='hidden md:flex space-x-4'>{navList()}</nav>
				{user ? (
					<div
						onClick={toggleAvatarDropdown}
						className='relative transition-all duration-500'>
						<button
							type='button'
							className='flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
							id='user-menu-button'
							aria-expanded='false'
							data-dropdown-toggle='user-dropdown'
							data-dropdown-placement='bottom'>
							<span className='sr-only'>Open user menu</span>
							<img
								className='w-8 h-8 rounded-full'
								src={user.profile_pic}
								alt='user photo'
							/>
						</button>
						<div
							className={`absolute ${
								openAvatarDropdown ? 'block' : 'hidden'
							} bg-slate-300 rounded shadow-md space-y-2`}
							onMouseLeave={() => setOpenAvatarDropdown(false)}>
							<div className='p-4 flex flex-col'>
								<NavLink
									className='hover:text-blue-900'
									to={`/profile/${user.id}`}>
									Profile
								</NavLink>
								<NavLink
									className='hover:text-blue-900'
									to={`/mystats/${user.id}`}>
									Stats
								</NavLink>
								<NavLink
									to='/login'
									className='hover:text-blue-900'
									onClick={handleLogoutClick}>
									Logout
								</NavLink>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</header>
	);
};

export default Navbar;
