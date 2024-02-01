import { NavLink } from 'react-router-dom';
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
			{showModal && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						right: 0,
						left: 0,
						bottom: 0,
						zIndex: 50,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<div
						style={{
							position: 'relative',
							padding: '1rem',
							maxWidth: '100%',
							maxHeight: '100%',
							overflowY: 'auto',
							overflowX: 'hidden',
							background: '#fff',
							borderRadius: '0.375rem',
							boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
							border: '1px solid #e5e7eb',
						}}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								padding: '1rem',
								borderBottom: '1px solid #d1d5db',
								borderRadius: '0.375rem 0.375rem 0 0',
							}}>
							<h3
								style={{
									fontSize: '1.125rem',
									fontWeight: '600',
									color: '#1a202c',
								}}>
								Create a ride
							</h3>
							<button
								style={{
									color: '#e53e3e',
									cursor: 'pointer',
									fontSize: '0.875rem',
									fontWeight: '500',
									padding: '0.5rem 1rem',
									borderRadius: '0.375rem',
									background: 'none',
									border: '1px solid transparent',
									transition: 'background-color 0.2s',
									hover: { backgroundColor: '#feb2b2' },
								}}
								onClick={() => setShowModal(false)}>
								Close
							</button>
						</div>
						<form
							onSubmit={handleSubmit}
							style={{ maxWidth: '24rem', margin: '0 auto', padding: '1rem' }}>
							<label
								style={{
									display: 'block',
									marginBottom: '0.5rem',
									fontSize: '0.875rem',
									color: '#1a202c',
								}}>
								Park-And-Ride Lot
							</label>
							<select
								id='lots'
								value={lotId}
								onChange={(e) => setLotId(e.target.value)}
								style={{
									width: '100%',
									padding: '0.5rem',
									fontSize: '0.875rem',
									border: '1px solid #d1d5db',
									borderRadius: '0.375rem',
								}}>
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
							<label className='block font-sm text-gray-900'>Resort</label>
							<select
								id='resort'
								value={resortId}
								onChange={(e) => setResortId(e.target.value)}
								style={{
									width: '100%',
									padding: '0.5rem',
									fontSize: '0.875rem',
									border: '1px solid #d1d5db',
									borderRadius: '0.375rem',
								}}>
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
							<label className='block font-sm text-gray-900'>
								Passenger Capacity
							</label>
							<select
								id='capacity'
								value={capacity}
								style={{
									width: '100%',
									padding: '0.5rem',
									fontSize: '0.875rem',
									border: '1px solid #d1d5db',
									borderRadius: '0.375rem',
								}}
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
							<p className='font-style: italic'>
								Please take into consideration space for gear and seatbelt laws
								when choosing a capacity.
							</p>
							<button
								type='submit'
								style={{
									marginTop: '1rem',
									padding: '0.75rem 1rem',
									fontSize: '1rem',
									fontWeight: '600',
									color: '#fff',
									background: '#1a202c',
									borderRadius: '0.375rem',
									cursor: 'pointer',
									transition: 'background-color 0.2s',
									hover: { backgroundColor: '#2d3748' },
								}}>
								Submit
							</button>
							{errorMessage && (
								<p style={{ color: '#e53e3e', marginTop: '1rem' }}>
									{errorMessage}
								</p>
							)}
							{message && (
								<p style={{ color: '#38a169', marginTop: '1rem' }}>{message}</p>
							)}
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default RideFormModal;
