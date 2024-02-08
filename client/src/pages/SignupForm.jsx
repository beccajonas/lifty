import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function SignupForm({
	handleSignup,
	errorMessage,
	setErrorMessage,
	setMessage,
	message,
}) {
	const [passwordOne, setPasswordOne] = useState('');
	const [passwordTwo, setPasswordTwo] = useState('');
	const [newEmail, setNewEmail] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		handleSignup(newEmail, passwordOne, passwordTwo);
	}

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setErrorMessage('');
			setMessage('');
		}, 3000);
		return () => clearTimeout(timeoutId);
	}, [errorMessage, message]);

	return (
		<>
			<video
				autoPlay
				loop
				muted
				className='absolute inset-0 w-full h-full object-cover z-0'
				style={{ zIndex: '-1' }}>
				<source
					src='../../public/lifty.mp4'
					type='video/mp4'
				/>
				Your browser does not support the video tag.
			</video>
			<div className='fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50'>
				<div className='p-5 max-w-full max-h-full overflow-y-auto overflow-x-hidden bg-indigo-200 border-2 border-indigo-300 rounded-md shadow relative'>
					<div className='flex justify-center m-4'>
						<NavLink to='/login'>
							<button className='py-2 px-4 text-white bg-indigo-700 rounded-md cursor-pointer transition duration-200 hover:bg-gray-700'>
								Back to Login
							</button>
						</NavLink>
					</div>
					<h1 className='text-center text-lg font-semibold mb-4'>Signup</h1>
					<div className='flex justify-center items-center'>
						<form onSubmit={handleSubmit}>
							<label
								htmlFor='email'
								className='block mb-2 text-m font-medium text-gray-900'>
								Your email
							</label>
							<input
								className='w-full p-2 text-sm bg-blue-100 rounded-md mb-3'
								placeholder='name@gmail.com'
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
							/>

							<label
								htmlFor='password'
								className='block mb-2 text-m font-medium text-gray-900'>
								Your password
							</label>
							<input
								type='password'
								className='w-full p-2 text-sm bg-blue-100 rounded-md mb-3'
								value={passwordOne}
								onChange={(e) => setPasswordOne(e.target.value)}
							/>

							<label
								htmlFor='repeat-password'
								className='block mb-2 text-m font-medium text-gray-900'>
								Repeat password
							</label>
							<input
								type='password'
								className='w-full p-2 text-sm bg-blue-100 rounded-md mb-3'
								value={passwordTwo}
								onChange={(e) => setPasswordTwo(e.target.value)}
							/>

							<button
								type='submit'
								className='mt-4 py-2 px-4 text-white bg-indigo-700 rounded-md cursor-pointer transition duration-200 hover:bg-gray-700'>
								Register new account
							</button>
							<div className='flex justify-center mt-4'>
								{errorMessage && <p className='text-red-500'>{errorMessage}</p>}
								{message && <p className='text-green-500'>{message}</p>}
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default SignupForm;
