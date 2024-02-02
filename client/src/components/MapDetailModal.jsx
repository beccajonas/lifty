function MapDetailModal({ setShowDetailModal, selectedMarker }) {
	console.log(selectedMarker);
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
							onClick={() => setShowDetailModal(false)}>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default MapDetailModal;
