import {
	Placement,
	arrow,
	offset,
	useClick,
	useFloating,
	useInteractions,
} from '@floating-ui/react';
import './tooltip.scss';
import React, { useEffect, useRef, useState } from 'react';
import { FloatingArrow } from '@floating-ui/react';
import { copyToClipboard } from 'src/shared/utils/functions';

type copyTooltipProps = {
	textToCopy: string;
	children: React.ReactNode;
	placement?: Placement;
	className?: string;
	large?: boolean;
};

export default function CopyTooltip({
	textToCopy,
	children,
	placement = 'top',
	className = '',
	large = false,
}: copyTooltipProps) {
	const arrowRef = useRef(null);
	const [showTooltip, setShowTooltip] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		placement,
		open: showTooltip,
		onOpenChange: copyText,
		middleware: [offset(10), arrow({ element: arrowRef })],
	});

	const click = useClick(context);

	const { getReferenceProps, getFloatingProps } = useInteractions([click]);

	async function copyText() {
		await copyToClipboard(textToCopy);
		setShowTooltip(true);
	}

	useEffect(() => {
		if (showTooltip) {
			const timer = setTimeout(() => setShowTooltip(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [showTooltip]);

	return (
		<div className="relative inline-block">
			<div
				className="tooltip-container-wrapper"
				{...getReferenceProps()}
				ref={refs.setReference}
			>
				{children}
			</div>
			{showTooltip && (
				<div
					className={`tooltip ${className} ${large ? 'w-[300px] !text-left' : 'w-max'}`}
					ref={refs.setFloating}
					{...getFloatingProps()}
					style={floatingStyles}
				>
					<FloatingArrow
						ref={arrowRef}
						context={context}
						className="fill-dark-900 dark:fill-light-900"
					/>
					<span>Text copied</span>
				</div>
			)}
		</div>
	);
}
