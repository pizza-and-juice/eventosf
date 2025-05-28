import ProfilePage from '@app/(header-footer-layout)/profile/profile.page';
import QUERY_KEYS from '@static/query.keys';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ProfilePageCtx } from '../profile.context';
import api from '@modules/data-fetching/api';
import ProjectComponent from '@components/not-reusable/project/project.nr-component';

export default function ProfileEventsTab() {
	const { state } = useContext(ProfilePageCtx);

	const { userId } = state;

	const userEventsQuery = useQuery({
		queryKey: [QUERY_KEYS.LIST_USER_REGISTERED_EVENTS, userId],
		queryFn: () => api.user_events.list({}),
	});

	const { data: userEvents, isLoading: userEventsLoading, isError } = userEventsQuery;

	if (isError || (!userEventsLoading && !userEvents)) {
		return <div>Error loading user events</div>;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-lg text-agrey-700 dark:text-agrey-400 font-medium">
				Eventos registrados
			</h2>

			{userEventsLoading ? (
				<div>Loading...</div>
			) : (
				<ul className="list-none space-y-2">
					{userEvents!.events.map((e, idx) => (
						<li key={idx}>
							<ProjectComponent
								isUpvoted={false}
								id={e.id}
								imageSrc={e.image}
								title={e.title}
								description={e.subtitle}
								categories={[]}
								upvotes={0}
								onCheckClick={() => {}}
								onUpvoteClick={() => {}}
								onCommentClick={() => {}}
								renderUpvote
								renderComments
								totalComments={0}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
