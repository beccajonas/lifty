import { NavLink } from 'react-router-dom';

function NoGroupDisplay() {
	return (
		<div className='m-2'>
			<div className='flex justify-center m-4 flex-col items-center text-center'>
				<div className='p-5 bg-indigo-200 rounded-sm'>
					Uh-Oh! Looks like you haven't posted or booked any rides yet!
				</div>
				<div className='p-5 m-3 bg-indigo-200 rounded-sm'>
					The rides you post or join will appear here.
				</div>
				<div>
					<NavLink to='/rides'>
						<button className='py-2 px-4 text-white bg-indigo-700 rounded-md cursor-pointer transition duration-200 hover:bg-gray-700'>
							Go book a ride here!
						</button>
					</NavLink>
				</div>
			</div>
		</div>
	);
}

export default NoGroupDisplay;
