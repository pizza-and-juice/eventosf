type StatBoxProps = {
	title: string;
	value: any;
	currency: any;
	className?: string;
	icon?: string;
};

function StatBox({ title, value, currency, className, icon }: StatBoxProps) {
	return (
		<div className={`bg-light-900 rounded-xl p-6 space-y-4 ${className || ''}`}>
			<h1 className="text-4xl font-bold">
				{currency} {value}
			</h1>
			<div className="flex items-center gap-4">
				<i className={icon}></i>
				<h2 className="text-xl">{title}</h2>
			</div>
		</div>
	);
}

export default StatBox;
