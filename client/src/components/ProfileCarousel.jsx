import React, { useState } from 'react';

function ProfileCarousel({ profile }) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const totalSlides = 3;

	const slides = [
		{
			image:
				'https://static1.squarespace.com/static/5e7a324590664f18b1bfea0c/5e7a3801284dcc611ee13e6d/5edac9299ea26150800c2aad/1660347952839/altapeak.jpg?format=1500w',
			caption: `${profile.first_name} has saved`,
		},
		{
			image:
				'https://images.squarespace-cdn.com/content/v1/5c64e1562727be078751e511/1550117748319-WVVWF3R1E18CQDBFCP0G/snowmachines_stock',
			caption: `${profile.first_name} has saved`,
		},
		{
			image:
				'https://www.news10.com/wp-content/uploads/sites/64/2022/05/BeersGettyImages-1221429432.jpg?w=1280',
			caption: `${profile.first_name} has saved`,
		},
	];

	const nextSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
	};

	const prevSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
	};

	return (
		<div class='flex flex-col justify-center items-center mt-4 pr-3 pl-3 h-full w-full '>
			<div
				className='relative w-full h-60 ring-2 ring-gray-200 rounded-lg'
				data-carousel='slide'>
				<div class='relative h-60 overflow-hidden rounded-lg'>
					{/* Render the current slide based on the currentSlide index */}
					{slides.map((slide, index) => (
						<div
							key={index}
							className={`duration-700 ease-in-out ${
								index === currentSlide ? '' : 'hidden'
							}`}
							data-carousel-item
							style={{ position: 'relative' }}>
							<img
								src={slide.image}
								className='absolute block w-full h-60 object-cover'
								alt={`Slide ${index + 1}`}
							/>
							<div
								className='absolute inset-20 flex items-center justify-center rounded-lg bg-indigo-600 text-white mt-6 p-4 opacity-75'
								style={{ pointerEvents: 'none' }}>
								{slide.caption}
							</div>
						</div>
					))}
				</div>

				{/* Previous button */}
				<button
					type='button'
					onClick={prevSlide}
					class='absolute top-0 start-0 z-30 flex items-center justify-center h-60 px-4 cursor-pointer group focus:outline-none'
					data-carousel-prev>
					<span class='inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-300 group-focus:outline-none'>
						<svg
							class='w-2 h-2 text-black rtl:rotate-180'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 6 10'>
							<path
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d='M5 1 1 5l4 4'
							/>
						</svg>
						<span class='sr-only'>Previous</span>
					</span>
				</button>

				{/* Next button */}
				<button
					type='button'
					onClick={nextSlide}
					class='absolute top-0 end-0 z-30 flex items-center justify-center h-60 px-4 cursor-pointer group focus:outline-none'
					data-carousel-next>
					<span class='inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-300 group-focus:outline-none'>
						<svg
							class='w-2 h-2 text-black rtl:rotate-180'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 6 10'>
							<path
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d='m1 9 4-4-4-4'
							/>
						</svg>
						<span class='sr-only'>Next</span>
					</span>
				</button>
			</div>
		</div>
	);
}

export default ProfileCarousel;
