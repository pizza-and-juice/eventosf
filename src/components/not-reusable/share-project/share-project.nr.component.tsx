import CopyTooltip from '@components/internal/tooltip/copy-tooltip.component';

type Props = {
	eventId: string; // or string, depending on how you're handling IDs
};

export default function ShareProjectPanel({ eventId }: Props) {
	const shareUrl = `${window.location.origin}/events/${eventId}`;

	const shareItems = [
		{
			icon: 'fa-twitter',
			label: 'Twitter',
			href: `https://twitter.com/intent/tweet?text=Check out this link: ${encodeURIComponent(
				window.location.href
			)}`,
		},
		{
			icon: 'fa-linkedin',
			label: 'LinkedIn',
			href: `https://www.linkedin.com/share?url=${encodeURIComponent(shareUrl)}`,
		},
		{
			icon: 'fa-telegram',
			label: 'Telegram',
			href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
		},
		{
			icon: 'fa-whatsapp',
			label: 'WhatsApp',
			href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
		},
	];

	return (
		<div className=" py-2 bg-white dark:bg-dark-800 w-[220px] rounded-xl shadow-lg z-contextAside">
			<div className="space-y-4">
				<div className="px-4 space-y-1">
					<h3 className="text-lg font-medium text-black dark:text-agrey-400">
						Copiar link
					</h3>
					<div className="px-3 py-2 flex gap-x-2 bg-light-900 items-center dark:bg-dark-900 rounded-xl">
						<div className="flex-grow min-w-0 overflow-hidden text-ellipsis text-black dark:text-white">
							{window.location.href}
						</div>

						<CopyTooltip textToCopy={shareUrl}>
							<button className="text-link p-1 grid place-items-center">
								<i className="fa-solid text-xl fa-clone text-agrey-700 dark:text-agrey-400 " />
							</button>
						</CopyTooltip>
					</div>
				</div>

				{/* second container */}
				<div>
					<h3 className="px-4 text-sm text-agrey-700 dark:text-agrey-400 font-medium">
						O compartir en
					</h3>
					{shareItems.map((item, idx) => (
						<div key={idx}>
							<a
								href={item.href}
								target="_blank"
								rel="noreferrer noopener"
								className="flex py-2 px-4 gap-x-2 items-center text-gray-700 dark:text-gray-400   hover:bg-light-400 dark:hover:bg-dark-400 transition-colors duration-300 ease-in-out"
							>
								<span>
									<i
										className={`fa-brands text-xl ${item.icon} text-agrey-700 dark:text-agrey-400 mr-2`}
									></i>
								</span>
								<span>{item.label}</span>
							</a>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
