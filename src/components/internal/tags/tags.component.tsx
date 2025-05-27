import './tags.component.scss';

type Props = {
	children: React.ReactNode;
	size?: string;
	disabled?: boolean;
	w_cross?: boolean;
	selected?: boolean;
	onDelete?: () => void;
};

export default function Tag({
	children,
	size = 'normal',
	disabled = false,
	w_cross = false,
	selected = false,
	onDelete,
}: Props) {
	return (
		<button
			type="button"
			disabled={disabled}
			className={`tag_button ${
				selected
					? 'bg-ablue-500 text-white'
					: 'dark:bg-dark-700 hover:dark:bg-dark-400 hover:text-ablue-200 transition duration-300 ease-in-out bg-light-700 dark:text-white text-black'
			} ${
				size === 'small'
					? 'h-[18px] px-1.5 py-0.5 rounded text-xs'
					: 'px-2 py-1 h-[32px] rounded-lg text-sm'
			}`}
		>
			{children}
			{w_cross && (
				<i
					className={`fas fa-times pt-0.5 ${
						disabled ? 'text-ghostly_grey-100' : 'dark:text-agrey-400 text-agrey-700'
					}
					${size === 'small' ? '' : 'text-base'}`}
					onClick={onDelete}
				></i>
			)}
		</button>
	);
}
