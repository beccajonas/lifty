import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

function RideForm({
	lots,
	resorts,
	user,
	setErrorMessage,
	errorMessage,
	setMessage,
	message,
}) {
	const [lotId, setLotId] = useState('');
	const [resortId, setResortId] = useState('');
	const [capacity, setCapacity] = useState('');

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setErrorMessage('');
			setMessage('');
		}, 3000);
		return () => clearTimeout(timeoutId);
	}, [errorMessage, message]);

	function handleSubmit(e) {
		e.preventDefault();
		console.log('click');
		console.log(lotId);
		console.log(resortId);
		console.log(capacity);
		const newRide = {
			driver_id: user.id,
			lot_id: parseInt(lotId),
			resort_id: parseInt(resortId),
			capacity: parseInt(capacity),
		};
		try {
			fetch(`/api/users/${user.id}/new_ride`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify(newRide),
			})
				.then((res) => {
					if (!res.ok) {
						return res.json().then((data) => {
							console.log(data.error);
							setErrorMessage(data.error);
							throw new Error(data.error);
						});
					}
					return res.json();
				})
				.then((data) => {
					console.log(data);
					setMessage('Ride posted successfully!');
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

	return (
		<>
			<h1> Ride Form</h1>
			<NavLink
				to='/rides'
				type='button'
				className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'>
				See All Rides
			</NavLink>
			<div>
				<form
					onSubmit={handleSubmit}
					className='max-w-sm mx-auto'>
					<label className='block text-sm text-gray-900'>
						Park-And-Ride Lot
					</label>
					<select
						id='lots'
						value={lotId}
						onChange={(e) => setLotId(e.target.value)}
						className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
						{lots.map((lot) => (
							<option
								key={lot.id}
								value={lot.id}>
								{lot.lot_name}
							</option>
						))}
					</select>
					<label className='block font-sm text-gray-900'>Resort</label>
					<select
						id='resort'
						value={resortId}
						onChange={(e) => setResortId(e.target.value)}
						className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
						{resorts.map((resort) => (
							<option
								key={resort.id}
								value={resort.id}>
								{resort.resort_name}
							</option>
						))}
					</select>
					<label className='block font-sm text-gray-900'>
						Passenger Capacity
					</label>
					<select
						id='capacity'
						value={capacity}
						onChange={(e) => setCapacity(e.target.value)}
						className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
					</select>
					<p className='font-style: italic'>
						Please take into consideration space for gear and seatbelt laws when
						choosing a capacity.
					</p>
					<button
						type='submit'
						className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
						Submit
					</button>
					{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
					{message && <p style={{ color: 'green' }}>{message}</p>}
				</form>
			</div>
		</>
	);
}

export default RideForm;
