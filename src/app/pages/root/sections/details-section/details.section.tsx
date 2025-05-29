import ROUTES from 'src/static/router.data';
import './more-grant.css';
import Button from 'src/components/internal/button/button.component';
import { Link } from 'react-router-dom';

function FeatureBox({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div className={`bg-light-900 dark:bg-dark-900 p-8  rounded-[24px] ${className}`}>
			{children}
		</div>
	);
}

export default function DetailsSection() {
	return (
		<section className="py-10 px-6 sm:px-8 lg:px-[100px]  cursor-default">
			{/* first grid */}
			<div className="grid grid-cols-1 sm:grid-cols-12 gap-10 ">
				{/* left side */}
				<div className="col-span-1 sm:col-span-5">
					<FeatureBox className="h-full">
						{/* img con */}
						<div className=" flex justify-center ">
							<img src="media/landing/cubes.png" alt="" />
						</div>

						{/* text con */}
						<div className="space-y-6">
							<h1 className="text-2xl sm:text-4xl font-bold text-black dark:text-white">
								Crea tu evento
							</h1>
							<p className=" text-black dark:text-agrey-400">
								Tan solo tienes que seguir estos pasos para empezar a ser parte de
								mis eventos
							</p>

							<br />

							<Link to={ROUTES.events.create}>
								<Button className="blue small w-[150px] hover:scale-105 transition duration-300 ease-in-out">
									Comenzar
								</Button>
							</Link>
						</div>
					</FeatureBox>
				</div>

				{/* right side */}
				<div className="col-span-1 sm:col-span-7">
					{/* second grid */}
					<div className="h-full grid grid-rows-3 lg:grid-rows-2 grid-cols-1 lg:grid-cols-2  gap-10">
						{/* Pitch idea */}
						<div className="row-span-1 col-span-1 lg:row-span-1 lg:col-span-2 ">
							<FeatureBox className="space-y-6 h-full">
								<h1 className="text-4xl font-bold text-black dark:text-white">1</h1>

								<div className="space-y-2">
									<h5 className="text-xl font-medium text-black dark:text-white">
										Crear una cuenta
									</h5>
									<h6 className="text-agrey-700 dark:text-agrey-400">
										Para comenzar, crea una cuenta en nuestra plataforma. Una
										vez registrado, podrás enviar tu propuesta de evento.
									</h6>
								</div>
							</FeatureBox>
						</div>

						{/* Start building */}
						<div className="row-span-1 col-span-1 lg:row-span-2 lg:col-span-1 ">
							<FeatureBox className="space-y-6 h-full">
								<h1 className="text-4xl font-bold text-black dark:text-white">2</h1>

								<div className="space-y-2">
									<h5 className="text-xl font-medium text-black dark:text-white">
										Crea tu evento
									</h5>
									<h6 className="text-agrey-700 dark:text-agrey-400">
										Completa el formulario de propuesta de evento, donde
										describirás tu idea, el formato del evento.
									</h6>
								</div>
							</FeatureBox>
						</div>

						{/* Get support */}
						<div className="row-span-1 col-span-1 lg:row-span-2 lg:col-span-1 ">
							<FeatureBox className="space-y-6 h-full">
								<h1 className="text-4xl font-bold text-black dark:text-white">3</h1>

								<div className="space-y-2">
									<h5 className="text-xl font-medium text-black dark:text-white">
										Obten actualizaciónes
									</h5>
									<h6 className="text-agrey-700 dark:text-agrey-400">
										Una vez que tu propuesta sea revisada por los usuarios,
										empezarás a recibir actualizaciones sobre el estado de tu
										evento.
									</h6>
								</div>
							</FeatureBox>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
