import { useState, useEffect } from 'react';

function RideFormModal({
	lots,
	resorts,
	user,
	setErrorMessage,
	errorMessage,
	setMessage,
	message,
	showModal,
	setShowModal,
	setBookRide,
}) {
	const [lotId, setLotId] = useState('');
	const [resortId, setResortId] = useState('');
	const [capacity, setCapacity] = useState('');
	const [dateTime, setDateTime] = useState('');
	const [roundTrip, setRoundTrip] = useState(false);
	const [mpg, setMpg] = useState(15);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setErrorMessage('');
			setMessage('');
		}, 3000);
		return () => clearTimeout(timeoutId);
	}, [errorMessage, message]);

	const handleMpgChange = (e) => {
		setMpg(parseFloat(e.target.value), 100);
	};

	async function handleSubmit(e) {
		e.preventDefault();

		if (!lotId) {
			setErrorMessage('Please select a park-and-ride lot.');
			return;
		}

		if (!resortId) {
			setErrorMessage('Please select a resort.');
			return;
		}

		if (!dateTime) {
			setErrorMessage('Please select a valid date and time.');
			return;
		}

		try {
			const newRide = {
				driver_id: user.id,
				lot_id: parseInt(lotId),
				resort_id: parseInt(resortId),
				capacity: parseInt(capacity),
				date_time: dateTime,
				roundtrip: roundTrip,
				mpg: mpg,
			};

			const response = await fetch(`/api/users/${user.id}/new_ride`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify(newRide),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.log('Error Response:', errorData);
				setErrorMessage(errorData.error);
				throw new Error(errorData.error);
			}

			const data = await response.json();
			console.log('Success Response:', data);
			setBookRide(true);
			setShowModal(!showModal);
			setMessage('Ride posted successfully!');
		} catch (error) {
			console.error('Error:', error.message);
			setErrorMessage(error.message);
		}
	}

	return (
		<>
			{showModal && (
				<div className='fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-sm backdrop-brightness-50'>
					<div className='relative p-4 max-w-full max-h-full overflow-y-auto overflow-x-hidden bg-indigo-200 border-2 border-indigo-300 rounded-md shadow '>
						<div className='flex justify-between p-4 border-b border-indigo-300 rounded-t-md'>
							<h3 className='text-xl font-semibold text-gray-800'>
								Create A Ride
							</h3>
							<button
								className='text-red-600 cursor-pointer text-sm font-medium py-2 px-4 rounded-md transition duration-200 hover:bg-red-200'
								onClick={() => setShowModal(false)}>
								Close
							</button>
						</div>
						<form
							onSubmit={handleSubmit}
							className='max-w-96 mx-auto p-4'>
							<label className='block text-sm font-semibold text-gray-900'>
								Park-And-Ride Lot
							</label>
							<select
								id='lots'
								value={lotId}
								onChange={(e) => setLotId(e.target.value)}
								className='w-full p-2 text-sm bg-blue-100 rounded-md mb-3
								'>
								<option
									value=''
									disabled>
									Select a lot
								</option>
								{lots.map((lot) => (
									<option
										key={lot.id}
										value={lot.id}>
										{lot.lot_name}
									</option>
								))}
							</select>

							<label className='block text-sm font-semibold text-gray-900'>
								Resort
							</label>
							<select
								id='resort'
								value={resortId}
								onChange={(e) => setResortId(e.target.value)}
								className='w-full p-2 text-sm  bg-blue-100 mb-3 rounded-md'>
								<option
									value=''
									disabled>
									Select a resort
								</option>
								{resorts.map((resort) => (
									<option
										key={resort.id}
										value={resort.id}>
										{resort.resort_name}
									</option>
								))}
							</select>

							<label className='block text-sm font-semibold text-gray-900'>
								Date and Time
							</label>
							<input
								type='datetime-local'
								id='datetime'
								value={dateTime}
								onChange={(e) => setDateTime(e.target.value)}
								className='w-full p-2 mb-3 text-sm bg-blue-100 rounded-md'
							/>

							<label className='block text-sm font-semibold text-gray-900'>
								Trip Type
							</label>
							<div className='flex items-center mb-3'>
								<label className='mr-4'>
									<input
										type='radio'
										id='oneWay'
										name='tripType'
										value='oneWay'
										checked={!roundTrip}
										onChange={() => setRoundTrip(false)}
										className='mr-1'
									/>
									One Way
								</label>
								<label>
									<input
										type='radio'
										id='roundTrip'
										name='tripType'
										value='roundTrip'
										checked={roundTrip}
										onChange={() => setRoundTrip(true)}
										className='mr-1'
									/>
									Round Trip
								</label>
							</div>

							<label className='block text-sm text-gray-900'>
								My car gets approximately{' '}
								<span className='font-semibold'>{mpg}</span> miles per gallon.
							</label>
							<input
								id='default-range'
								type='range'
								min='0'
								max='50'
								value={mpg}
								onChange={handleMpgChange}
								className='w-full h-2 mb-3 bg-blue-200 rounded-lg cursor-pointer'
							/>

							<label className='block text-sm font-semibold text-gray-900'>
								Passenger Capacity
							</label>
							<select
								id='capacity'
								value={capacity}
								className='w-full p-2 mb-3 text-sm bg-blue-100 rounded-md'
								onChange={(e) => setCapacity(e.target.value)}>
								<option
									value=''
									disabled>
									Select a number of passengers
								</option>
								<option>2</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
							</select>
							<p className='italic mt-1 text-sm'>
								Please take into consideration space for gear and seatbelt laws
								when choosing a capacity.
							</p>
							<button
								type='submit'
								className='mt-4 py-2 px-4 text-white bg-indigo-700 rounded-md cursor-pointer transition duration-200 hover:bg-gray-700'>
								Submit
							</button>
							{errorMessage && (
								<p className='text-red-600 mt-4'>{errorMessage}</p>
							)}
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default RideFormModal;
