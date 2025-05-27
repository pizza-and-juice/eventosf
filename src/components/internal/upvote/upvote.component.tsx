// scss
import './upvote.component.scss';

type Props = {
	size: 'small' | 'big';
	upvotes: number;
	onClick: () => void;
	isUpvoted: boolean;
};

export default function Upvote({ upvotes, size = 'small', onClick, isUpvoted }: Props) {
	function onUpvoteClick() {
		onClick();
	}

	return (
		<button
			onClick={onUpvoteClick}
			className={`upvote_button hover:scale-105 transition duration-300 ease-in-out ${isUpvoted && 'active'} ${size === 'big' ? '' : 'small'}`}
		>
			<div
				className={`flex items-center justify-center ${
					size === 'small' ? 'h-[30px] pt-1' : 'h-[24px] py-1'
				}`}
			>
				<i className="fas fa-caret-up w-[24px] "></i>
				<span className="w-[38px] h-[24px]">{upvotes}</span>
			</div>
			<span className={`${size === 'small' ? 'hidden' : ''} text-xs font-medium`}>
				Upvote
			</span>
		</button>
	);
}
