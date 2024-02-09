// Navbar.js

import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import logo from '../../public/logo.png';
import profilePic from '../../public/liftyprofilepic.png';

const Navbar = ({ user, handleLogout }) => {
	const [openAvatarDropdown, setOpenAvatarDropdown] = useState(false);

	const toggleAvatarDropdown = () => {
		setOpenAvatarDropdown(!openAvatarDropdown);
	};

	function handleLogoutClick() {
		handleLogout();
	}

	function navList() {
		return (
			<>
				{user ? (
					<NavLink
						to='/rides'
						className={({ isActive, isPending }) =>
							isPending
								? 'pending'
								: isActive
								? 'text-blue-900 font-semibold'
								: ''
						}>
						Rides
					</NavLink>
				) : null}
				<NavLink
					to='/about'
					className={({ isActive, isPending }) =>
						isPending
							? 'pending'
							: isActive
							? 'text-blue-900 font-semibold'
							: ''
					}>
					About
				</NavLink>
				<NavLink
					to='/collectiveimpact'
					className={({ isActive, isPending }) =>
						isPending
							? 'pending'
							: isActive
							? 'text-blue-900 font-semibold'
							: ''
					}>
					Collective Impact
				</NavLink>
				{user ? null : (
					<NavLink
						to='/login'
						className={({ isActive, isPending }) =>
							isPending
								? 'pending'
								: isActive
								? 'text-blue-900 font-semibold'
								: ''
						}>
						Login
					</NavLink>
				)}
			</>
		);
	}

	return (
		<header className='bg-gradient-to-l from-indigo-500 border-gray-200 font-sans'>
			<div className='container mx-auto py-1 px-2 md:flex md:items-center md:justify-between '>
				<div className='flex items-center justify-between'>
					<img
						className='object-contain h-20'
						src={logo}
						alt=''
					/>
				</div>
				<nav className='hidden md:flex space-x-5'>{navList()}</nav>
				{user ? (
					<div
						onClick={toggleAvatarDropdown}
						className='relative transition-all duration-500 mr-3'>
						<button
							type='button'
							className='flex text-sm bg-gray-800 rounded-full md:me-0'
							id='user-menu-button'
							aria-expanded='false'
							data-dropdown-toggle='user-dropdown'
							data-dropdown-placement='bottom'>
							<span className='sr-only'>Open user menu</span>
							<img
								className='object-cover h-14 w-14 rounded-full border-2 border-blue-200'
								src={user.profile_pic || profilePic}
								alt='user photo'
							/>
						</button>
						<div
							className={`absolute ${
								openAvatarDropdown ? 'block' : 'hidden'
							}  rounded shadow-md space-y-31 bg-blue-200 justify-center`}
							onMouseLeave={() => setOpenAvatarDropdown(false)}
							style={{ zIndex: 9999 }}>
							<div className='p-3 flex flex-col justify-center items-center'>
								<NavLink
									className='hover:text-blue-900'
									to={`/myprofile/${user.id}`}>
									Profile
								</NavLink>
								<NavLink
									className='hover:text-blue-900'
									to={`/myprofile/${user.id}/messages`}>
									Messages
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
