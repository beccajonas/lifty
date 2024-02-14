import React, { useState } from 'react';

function UserProfileCarousel({ firstName, snowData, beerData, treeData }) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const totalSlides = 3;

	// Calculate hours and minutes
	const hours = Math.floor(snowData / 60);
	const minutes = snowData % 60;

	const slides = [
		{
			image:
				'https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/snow-covered-pine-trees-thinkstock-images.jpg',
			caption: `By carpooling with Lifty, you've removed the same amount of C02 as ${treeData} trees do in a year.`,
			alt: 'Snowy trees',
		},
		{
			image:
				'https://images.squarespace-cdn.com/content/v1/5c64e1562727be078751e511/1550117748319-WVVWF3R1E18CQDBFCP0G/snowmachines_stock',
			caption: `By carpooling with Lifty, you have saved enough energy to run a snow machine for ${hours} hours and ${minutes} minutes.`,
			alt: 'Snow machine blowing snow at night',
		},
		{
			image:
				'https://www.news10.com/wp-content/uploads/sites/64/2022/05/BeersGettyImages-1221429432.jpg?w=1280',
			caption: `By carpooling with Lifty, you have saved enough energy to brew ${beerData} beers.`,
			alt: 'Top down view of various glasses of beer',
		},
	];

	const nextSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
	};

	const prevSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
	};

	return (
		<div className='flex flex-col justify-center items-center mt-4 pr-3 pl-3 h-full w-full '>
			<div
				className='relative w-full h-60 ring-2 ring-gray-200 rounded-lg'
				data-carousel='slide'>
				<div className='relative h-60 overflow-hidden rounded-lg'>
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
								className='absolute block w-full h-60 object-cover filter brightness-75'
								alt={slide.alt}
							/>
							<div
								className='absolute inset-20 flex items-center justify-center rounded-lg bg-indigo-600 text-white mt-4 p-8'
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
					className='absolute top-0 start-0 z-30 flex items-center justify-center h-60 px-4 cursor-pointer group focus:outline-none'
					data-carousel-prev>
					<span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-300 group-focus:outline-none'>
						<svg
							className='w-2 h-2 text-black rtl:rotate-180'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 6 10'>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M5 1 1 5l4 4'
							/>
						</svg>
						<span className='sr-only'>Previous</span>
					</span>
				</button>

				{/* Next button */}
				<button
					type='button'
					onClick={nextSlide}
					className='absolute top-0 end-0 z-30 flex items-center justify-center h-60 px-4 cursor-pointer group focus:outline-none'
					data-carousel-next>
					<span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-300 group-focus:outline-none'>
						<svg
							className='w-2 h-2 text-black rtl:rotate-180'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 6 10'>
							<path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='m1 9 4-4-4-4'
							/>
						</svg>
						<span className='sr-only'>Next</span>
					</span>
				</button>
			</div>
		</div>
	);
}

export default UserProfileCarousel;
