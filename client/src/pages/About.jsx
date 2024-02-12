import { useState } from 'react';

function About() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const totalSlides = 3;

	const slides = [
		{
			image:
				'https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/snow-covered-pine-trees-thinkstock-images.jpg',
			caption: `Trees Planted: This conversion assumes an average absorption rate of 48 pounds of CO2 per tree per year and divides the total emissions by this rate, rounding up to the nearest whole number.`,
		},
		{
			image:
				'https://images.squarespace-cdn.com/content/v1/5c64e1562727be078751e511/1550117748319-WVVWF3R1E18CQDBFCP0G/snowmachines_stock',
			caption: `Snow Machine: This conversion calculates the emissions to kilowatt-hours (kWh) by dividing by pounds of CO2 a carbon emission factor of 4.33e-4, then calculates the runtime based on the energy consumption of a snow machine.`,
		},
		{
			image:
				'https://www.news10.com/wp-content/uploads/sites/64/2022/05/BeersGettyImages-1221429432.jpg?w=1280',

			caption: `Beers Brewed: This conversion calculates the emissions to kilowatt-hours (kWh) by dividing by pounds of CO2 a carbon emission factor of 4.33e-4, then calculates the runtime of a brewery based on the energy consumption of brewing equipment. Assuming a standard beer barrel size and pour size, it determines the total number of beers brewed.`,
		},
	];

	const nextSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
	};

	const prevSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
	};
	return (
		<div className='bg-blue-200'>
			<div className='flex justify-center bg-blue-200 pt-4 outline-dashed'>
				<div className='text-xl pl-2 pr-2 text-center'>About Lifty</div>
			</div>
			<div className='flex m-2 outline-dashed'>
				<div className='w-1/3'>
					<div className='bg-blue-100 m-6 rounded-lg ring-2 pb-4'>
						<div className='text-2xl font-medium p-4'>
							Conversions
							<p className='text-base font-normal pt-4 pb-1'>
								Lifty is committed to measuring the impact our users make.
								That's why we quantify the carbon emissions saved through
								carpooling on each user's profile, translating them into metrics
								that resonate with the average skier and snowboarder.
								<br></br>
								<br></br>
								Conversion methods were created with help from the United State
								Enviornmental Protection Agency Greenhouse Gas Equivalencies
								Calculator.
							</p>
						</div>
					</div>
				</div>
				<div className='w-2/3'>
					<div className='flex flex-col justify-center items-center pr-3 pl-3 pb-10 pt-5 h-full w-full'>
						<div
							className='relative w-full h-80 ring-2 ring-gray-200 rounded-lg'
							data-carousel='slide'>
							<div className='relative h-80 overflow-hidden rounded-lg'>
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
											className='absolute block w-full h-80 object-cover'
											alt={`Slide ${index + 1}`}
										/>
										<div
											className='absolute inset-20 flex items-center justify-center rounded-lg bg-indigo-600 text-white mt-5 p-16'
											style={{ pointerEvents: 'none' }}>
											<span class='italic'>{slide.caption}</span>
										</div>
									</div>
								))}
							</div>

							{/* Previous button */}
							<button
								type='button'
								onClick={prevSlide}
								className='absolute top-0 start-0 z-30 flex items-center justify-center h-80 px-4 cursor-pointer group focus:outline-none'
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
								className='absolute top-0 end-0 z-30 flex items-center justify-center h-80 px-4 cursor-pointer group focus:outline-none'
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
				</div>
			</div>
			<div className='flex m-2 outline-dashed'>
				<div className='w-2/3'>
					<div className='bg-blue-100 m-6 rounded-lg ring-2 pb-4'>
						<div className='text-2xl font-medium p-4'>
							Conversions
							<p className='text-base font-normal pt-4 pb-1'>
								Lifty is committed to measuring the impact our users make.
								That's why we quantify the carbon emissions saved through
								carpooling on each user's profile, translating them into metrics
								that resonate with the average skier and snowboarder.
								<br></br>
								<br></br>
								Conversion methods were created with help from the United State
								Enviornmental Protection Agency Greenhouse Gas Equivalencies
								Calculator.
							</p>
						</div>
					</div>
				</div>
				<div className='w-1/3 outline-dashed'></div>
			</div>
		</div>
	);
}

export default About;
