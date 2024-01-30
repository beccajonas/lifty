import { useState, useEffect } from 'react';
import SignupForm from './SignupForm.jsx';

function LoginPage({ handleLogin, returningUser, setReturningUser }) {
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [message, setMessage] = useState('');

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

	function handleSignup(newEmail, passwordOne, passwordTwo) {
		console.log(
			`New Email: ${newEmail} | Password1: ${passwordOne} | Password2: ${passwordTwo}`
		);
		if (passwordOne !== passwordTwo) {
			setErrorMessage('Passwords do not match. Try again.');
			return;
		} else {
			const newUser = {
				email: newEmail,
				password: passwordOne,
			};
			try {
				fetch(`/api/signup`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newUser),
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
					.then((data) => {
						console.log(data);
						setReturningUser(true);
						setMessage('Sign up successful! Please Login.');
					})
					.catch((error) => {
						console.log(error);
						setErrorMessage(error.message);
					});
			} catch (error) {
				console.log(error);
				setErrorMessage(error);
			}
		}
	}

	return (
		<div>
			<h1>{returningUser ? 'Login' : 'Signup'}</h1>
			{returningUser ? (
				<>
					<form onSubmit={handleSubmit}>
						<input
							type='text'
							placeholder='Email'
							name='Email'
							value={loginEmail}
							onChange={(e) => setLoginEmail(e.target.value)}
						/>
						<input
							type='text'
							placeholder='Password'
							name='Password'
							value={loginPassword}
							onChange={(e) => setLoginPassword(e.target.value)}
						/>
						<button type='submit'>Login</button>
					</form>
					<button onClick={() => setReturningUser(false)}>Signup</button>
					{message && <p style={{ color: 'green' }}>{message}</p>}
				</>
			) : (
				<SignupForm
					setReturningUser={setReturningUser}
					handleSignup={handleSignup}
					error={errorMessage}
				/>
			)}
		</div>
	);
}

export default LoginPage;
