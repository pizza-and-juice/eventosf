import { Fragment } from 'react';
import './we-support.css';

export default function SupportSection() {
	const words = [
		'ideas we love, ',
		'dreams, ',
		'passion, ',
		'crazy, ',
		'surprises,',
		'possible, ',
		'impossible, ',
		'invention, ',
		'reinvention, ',
		'new,',
		'freedom, ',
		'guts, ',
		'perseverance, ',
		'independence, ',
		'fun.',
	];

	return (
		<section className="py-10 space-y-6 overflow-hidden cursor-default">
			<h6 className="text-center text-2xl dark:text-white mb-[24px]">We support</h6>
			{/* text div */}

			<div className="relative  flex justify-center md:px-40">
				{/* <h4 className="text-[20px] md:text-[56px] font-bold block  dark:text-white"> <span className="text-agrey-700 dark:text-agrey-400">ideas we love,</span> dreams, <span className="text-agrey-700 dark:text-agrey-400">passion,</span>  crazy, <span className="text-agrey-700 dark:text-agrey-400">surprises,</span> <br/>   possible, <span className="text-agrey-700 dark:text-agrey-400">impossible,</span>   invention, <span className="text-agrey-700 dark:text-agrey-400">reinvention,</span>  new <br/> <span className="text-agrey-700 dark:text-agrey-400">freedom,</span>  guts, <span className="text-agrey-700 dark:text-agrey-400">perseverance,</span>  independence, <span className="text-agrey-700 dark:text-agrey-400">fun</span> </h4> */}

				<h1 className="text-nowrap text-xl sm:text-[36px] lg:text-[56px] font-bold text-center sm:leading-[40px] lg:leading-[60px] ">
					{words.map((word, i) => (
						<Fragment key={i}>
							<span
								key={i}
								className={
									i % 2 === 0
										? 'text-black dark:text-white'
										: 'text-agrey-700 dark:text-agrey-400'
								}
							>
								{word}
							</span>

							{(i + 1) % 5 === 0 && <br />}
						</Fragment>
					))}
				</h1>
			</div>
		</section>
	);
}
