type Props = {
	status: string;
};

export default function Status({ status }: Props) {
	return (
		<div
			className={`flex items-center gap-x-3 bg-light-700 dark:bg-dark-400 rounded-lg py-1 pl-2 pr-4 text-sm w-fit`}
		>
			<div
				className={`rounded-3xl p-[2.8px] ml-1 ${
					status === 'approved' ? 'bg-[#009545]' : ''
				}
				${status === 'pending' ? 'bg-ghostly_grey-300' : ''}
				${status === 'rejected' ? 'bg-ared-500' : ''}`}
			></div>
			{status === 'approved' && <span className={`text-[#009545]`}>Approved</span>}
			{status === 'pending' && <span className={`text-ghostly_grey-300`}>Pending</span>}
			{status === 'rejected' && <span className={`text-ared-500`}>Rejected</span>}
		</div>
	);
}
