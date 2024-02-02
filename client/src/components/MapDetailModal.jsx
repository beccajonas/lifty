import { NavLink } from 'react-router-dom';

function MapDetailModal({ setShowMapDetailModal, selectedMarker }) {
	return (
		<>
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
								fontSize: '1rem',
								fontWeight: '600',
								color: '#1a202c',
							}}>
							Ride Details
						</h3>
						<button
							style={{
								color: '#e53e3e',
								cursor: 'pointer',
								fontSize: '0.875rem',
								fontWeight: '500',
								padding: '0.2rem 1rem',
							}}
							onClick={() => setShowMapDetailModal(false)}>
							Close
						</button>
					</div>
					<div>
						<div class='flex items-center mt-1 mb-1 gap-4'>
							<img
								className='w-10  rounded-full ring-2 ring-gray-300'
								src={selectedMarker.driver.profile_pic}
								alt=''
							/>
							<div class='font-medium'>
								<div>
									<NavLink to={`/profile/${selectedMarker.driver.id}`}>
										Driver: {selectedMarker.driver.first_name}{' '}
										{selectedMarker.driver.last_name}
									</NavLink>
								</div>
								<div class='text-sm text-gray-500 dark:text-gray-400'>
									Total Drives in Lifty:{' '}
									{selectedMarker.driver.rides_as_driver.length}
								</div>
							</div>
						</div>
						<p>Meet At: {selectedMarker.lot.address}</p>
						<p>Resort: {selectedMarker.resort.resort_name}</p>
						<p>
							Passenger Spots: {selectedMarker.passengers.length} /{' '}
							{selectedMarker.capacity}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default MapDetailModal;
