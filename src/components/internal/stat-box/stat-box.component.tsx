type StatBoxProps = {
	title: string;
	value: any;
	className?: string;
};

export default function StatBox({ title, value, className }: StatBoxProps) {
	return (
		<div
			className={`flex gap-x-4 gap-y-2 items-center sm:flex-col sm:items-start   bg-light-900 dark:bg-dark-900 rounded-xl p-6  h-full  ${
				className || ''
			} `}
		>
			<h1 className="text-4xl font-bold text-black dark:text-white align-sub">{value}</h1>
			<h2 className="text-xl text-black dark:text-white ">{title}</h2>
		</div>
	);
}
