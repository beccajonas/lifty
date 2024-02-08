import { useState, useEffect } from 'react';
import { Navigate, NavLink } from 'react-router-dom';

function LoginPage({
	handleLogin,
	errorMessage,
	setErrorMessage,
	user,
	message,
	setMessage,
}) {
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [showModal, setShowModal] = useState(true);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setErrorMessage('');
			setMessage('');
		}, 3000);
		return () => clearTimeout(timeoutId);
	}, [errorMessage, message]);

	function handleSubmit(e) {
		e.preventDefault();
		handleLogin(loginEmail, loginPassword);
	}

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
			<div className='relative z-10'></div>
			{user ? (
				<Navigate to='/rides' />
			) : (
				<>
					<div className='flex justify-center items-center h-full'>
						<button
							onClick={openModal}
							className='mt-4 py-2 px-4 text-white bg-indigo-700 rounded-md cursor-pointer transition duration-200 hover:bg-gray-700'>
							Open Login
						</button>
					</div>
					{showModal && (
						<div className='fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50'>
							<div className='p-5 max-w-full max-h-full overflow-y-auto overflow-x-hidden bg-indigo-200 border-2 border-indigo-300 rounded-md shadow relative'>
								<div>
									<button
										className='absolute top-0 right-0 text-red-600 m-2 cursor-pointer text-sm font-medium py-2 px-4 rounded-md transition duration-200 hover:bg-red-200'
										onClick={closeModal}>
										Close
									</button>
								</div>
								<h1 className='text-center text-lg font-semibold mb-4'>
									Login
								</h1>
								<div className='flex justify-center items-center'>
									<form onSubmit={handleSubmit}>
										<input
											type='text'
											placeholder='Email'
											name='Email'
											className='w-full p-2 text-sm bg-blue-100 rounded-md mb-3'
											value={loginEmail}
											onChange={(e) => setLoginEmail(e.target.value)}
										/>
										<input
											type='password'
											placeholder='Password'
											name='Password'
											className='w-full p-2 text-sm bg-blue-100 rounded-md mb-3'
											value={loginPassword}
											onChange={(e) => setLoginPassword(e.target.value)}
										/>
										<button
											type='submit'
											className='mt-4 py-2 px-4 text-white bg-indigo-700 rounded-md cursor-pointer transition duration-200 hover:bg-gray-700'>
											Login
										</button>
										<div className='flex justify-center mt-4'>
											{errorMessage && (
												<p className='text-red-500'>{errorMessage}</p>
											)}
											{message && <p className='text-green-500'>{message}</p>}
										</div>
									</form>
								</div>
								<div className='flex justify-center items-center'>
									<NavLink to='/signup'>
										<button className='mt-4 py-2 px-4 text-white bg-indigo-700 rounded-md cursor-pointer transition duration-200 hover:bg-gray-700'>
											New to Lifty? Signup Here.
										</button>
									</NavLink>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default LoginPage;
