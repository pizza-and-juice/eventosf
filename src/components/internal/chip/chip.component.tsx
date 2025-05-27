type Props = {
	className?: string;
	children: React.ReactNode;
	onDelete: () => void;
};

export default function Chip({ className, children, onDelete }: Props) {
	return (
		<div className={`chip ${className}`}>
			<span>{children}</span>

			<span>
				<button onClick={onDelete} type="button">
					<i className="fa-solid fa-times" onClick={onDelete}></i>
				</button>
			</span>
		</div>
	);
}
