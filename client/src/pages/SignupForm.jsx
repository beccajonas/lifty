import { useState, useEffect } from 'react';
function SignupForm({ setReturningUser, handleSignup, error }) {
	const [passwordOne, setPasswordOne] = useState('');
	const [passwordTwo, setPasswordTwo] = useState('');
	const [newEmail, setNewEmail] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		handleSignup(newEmail, passwordOne, passwordTwo);
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Email'
					name='Email'
					value={newEmail}
					onChange={(e) => setNewEmail(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Password'
					name='Password'
					value={passwordOne}
					onChange={(e) => setPasswordOne(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Confirm Password'
					name='Confirm Password'
					value={passwordTwo}
					onChange={(e) => setPasswordTwo(e.target.value)}
				/>
				<button type='submit'>Sign Up</button>
			</form>
			<button onClick={() => setReturningUser(true)}>Back to Login</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</>
	);
}

export default SignupForm;
