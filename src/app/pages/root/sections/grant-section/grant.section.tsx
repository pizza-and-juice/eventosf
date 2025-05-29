import './grant.scss';

export default function GrantSection() {
	return (
		<section className="relative h-[60vh] py-20 px-6 sm:py-20 sm:px-8 lg:py-10 lg:px-[100px]">
			<div className="absolute top-0 left-0 h-full w-full bgg"></div>

			{/* row con */}
			<div className="h-full flex flex-col justify-center gap-y-10 ">
				{/* grant overviwe con */}
				<div className="space-y-8">
					<h1 className="text-2xl sm:text-4xl lg:text-[56px] text-center font-bold text-black dark:text-white">
						Mas de 100,000 eventos creados
					</h1>
					<p className="text-center text-base sm:text-2xl text-black dark:text-white ">
						¡Únete a nuestra comunidad de creadores de eventos y comparte tus
						experiencias con el mundo! Aquí encontrarás inspiración, recursos y una
						plataforma para hacer realidad tus ideas. Desde eventos pequeños hasta
						grandes conferencias, estamos aquí para ayudarte a crear momentos
						inolvidables.
					</p>
				</div>

				{/* grant rules */}
				{/* <div className="flex flex-col md:flex-row  justify-center items-center  gap-x-8 gap-y-8">
					{rules.map((feature, index) => (
						<div
							key={index}
							className=" w-[327px] h-[78px] sm:w-[223px] sm:[200px]  lg:w-[350px] lg:h-[200px] space-y-2 lg:space-y-6 flex flex-col justify-center items-center "
						>
							<h3 className="text-center text-2xl sm:text-4xl lg:text-[56px] font-medium  text-black dark:text-white">
								{feature.title}
							</h3>
							<h6 className="text-center text-base sm:text-xl lg:text-2xl  text-black dark:text-white">
								{feature.description}
							</h6>
						</div>
					))}
				</div> */}
			</div>
		</section>
	);
}
