import ROUTES from 'src/static/router.data';
import './more-grant.css';
import Button from 'src/components/internal/button/button.component';

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
								More Grant Tiers
							</h1>
							<p className=" text-black dark:text-agrey-400">
								More funding options coming soon to help you scale your ambitious
								ideas.
							</p>

							<Button
								className="blue small w-[150px] hover:scale-105 transition duration-300 ease-in-out"
								tag_type="link"
								href={ROUTES.grantApply}
							>
								Apply Now
							</Button>
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
										Pitch your idea
									</h5>
									<h6 className="text-agrey-700 dark:text-agrey-400">
										Complete the grant application form to receive feedback
										fast. Your application stands the chance to garner upvotes
										from the PWR community, serving as an indicator for
										approval.
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
										Start Building
									</h5>
									<h6 className="text-agrey-700 dark:text-agrey-400">
										Upon approval, it's time to start building! Aim to deliver
										the Minimum Viable Product (MVP) within the next four weeks.
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
										Get Support
									</h5>
									<h6 className="text-agrey-700 dark:text-agrey-400">
										After successfully delivering the MVP, you will receive the
										grant, opening the door to potential additional funding
										support from the PWR network.
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
