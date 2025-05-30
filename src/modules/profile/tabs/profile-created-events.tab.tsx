// third party
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

// static
import QUERY_KEYS from '@static/query.keys';

// components
import EventCard from '@components/composed/event-card.component';

import { ProfilePageCtx } from '../profile.context';

// fata fetching
import api from '@modules/data-fetching/api';

export default function ProfileCreatedEventsTab() {
	const { state } = useContext(ProfilePageCtx);

	const { userId } = state;

	const userEventsQuery = useQuery({
		queryKey: [QUERY_KEYS.LIST_USER_CREATED_EVENTS, userId, `created_by_${userId}`],
		queryFn: () => api.user_events.list_created({ user_id: userId }),
	});

	const { data: userEvents, isLoading: userEventsLoading, isError } = userEventsQuery;

	if (isError || (!userEventsLoading && !userEvents)) {
		return <div>Error loading user events</div>;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-lg text-agrey-700 dark:text-agrey-400 font-medium">
				Eventos creados
			</h2>

			{userEventsLoading ? (
				<div>Loading...</div>
			) : (
				<ul className="list-none space-y-2">
					{userEvents!.events.map((e, idx) => (
						<li key={idx}>
							<EventCard
								id={e.id}
								title={e.title}
								subtitle={e.subtitle}
								image={e.image}
								attendees_capacity={e.attendees_capacity}
								confirmed_attendees={e.attendees}
								speakers={e.speakers}
								isRegistered={false}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
