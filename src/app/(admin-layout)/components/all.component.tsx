// import React, { useState, useEffect } from 'react';
// import StatBox from 'src/components/internal/stat-box/stat-box.component';
// import ProjectComponent from 'src/components/not-reusable/project/project.nr-component';
// import { useFormik } from 'formik';
// import ChartComponent from 'src/components/not-reusable/charts/chart.component';
// import Button from 'src/components/internal/button/button.component';

// import axios from 'axios';
// // import React, { useState, useContext } from 'react';
// import { useMutation, useQuery } from 'react-query';
// import QueryApi from 'src/shared/api/query-api';
// import { Todo } from 'src/shared/models/todos/todo.model';
// import queryClient from 'src/shared/query-client';
// import QUERY_KEYS from 'src/static/query.keys';
// import Tag from 'src/components/internal/tags/tags.component';

// import Upvote from 'src/components/internal/upvote/upvote.component';

// // the loading skeleton
// import LoadingSkeleton from './admin-loading-skeleton';

// export default function AllComponent() {
// 	// *~~~ formik ~~~* //
// 	const formik = useFormik({
// 		initialValues: {
// 			search: '',
// 		},

// 		onSubmit: (values) => {
// 			console.log(values);
// 		},
// 	});

// 	const chartOptions = {
// 		chart: {
// 			id: 'area-chart',
// 		},
// 		xaxis: {
// 			categories: [
// 				'Jan',
// 				'Feb',
// 				'Mar',
// 				'Apr',
// 				'May',
// 				'Jun',
// 				'Jul',
// 				'Aug',
// 				'Sep',
// 				'Oct',
// 				'Nov',
// 				'Dec',
// 			],
// 		},
// 	};

// 	const chartSeries = [
// 		{
// 			name: 'Users',
// 			data: [30, 40, 45, 50, 49, 60, 70, 91, 125, 65, 80, 100],
// 		},
// 	];

// 	const {
// 		data: projectsData,
// 		isLoading: projectsIsLoading,
// 		isError: projectsIsError,
// 	} = useQuery(QUERY_KEYS.GET_PROJECTS, QueryApi.projects.getAll);

// 	// for the total project submission
// 	const {
// 		data: totalSubmissions,
// 		isLoading: totalSubmissionIsLoading,
// 		isError: totalSubmissionsIsError,
// 	} = useQuery(QUERY_KEYS.GET_TOTAL_SUBMISSIONS, QueryApi.totalSubmission.fetchTotalSubmission);

// 	// for the total number of users
// 	const {
// 		data: totalUsers,
// 		isLoading: totalUsersIsLoading,
// 		isError: totalUsersIsError,
// 	} = useQuery(QUERY_KEYS.GET_TOTAL_USERS, QueryApi.totalUsers.fetchTotalUsers);

// 	const {
// 		data: projectStatus,
// 		isLoading: projectStatusIsLoading,
// 		isError: projectStatusIsError,
// 	} = useQuery(QUERY_KEYS.GET_PROJECT_STATUS, QueryApi.projectStatus.fetchProjectStatus);

// 	return (
// 		<main className="w-full sm:max-w-[700px]   space-y-10">
// 			{totalSubmissionIsLoading || totalUsersIsLoading || projectStatusIsLoading ? (
// 				<LoadingSkeleton />
// 			) : (
// 				<div className="w-full sm:max-w-[700px]   space-y-10">
// 					{/* title */}
// 					<section className="space-y-2">
// 						<h1 className="text-xl sm:text-4xl font-bold text-black dark:text-white">
// 							Dashboard
// 						</h1>
// 						<p className="text-sm text-agrey-700 dark:text-agrey-400">
// 							See all submissions, users and edit project pages here.
// 						</p>
// 					</section>
// 					{/* Search Bar */}
// 					<section>
// 						<form onSubmit={formik.handleSubmit}>
// 							<div className="field">
// 								<div className="form-control">
// 									<input
// 										className="text-field pr-20 pl-9"
// 										type="text"
// 										{...formik.getFieldProps('search')}
// 										placeholder="Search projects"
// 									/>

// 									{/* icon */}
// 									<div className="text-black dark:text-white absolute inset-y-0 left-0 flex items-center pl-3 ">
// 										<i className="fa-solid fa-magnifying-glass"></i>
// 									</div>

// 									{/* enter button */}
// 									<button className="absolute inset-y-0 right-0 flex items-center pr-3 ">
// 										<div className="flex justify-center items-center gap-x-2 text-light-600  dark:text-dark-500 hover:text-ablue-200">
// 											<i className="fa-solid fa-arrow-turn-down-right"></i>
// 											<h2>Enter</h2>
// 										</div>
// 									</button>
// 								</div>
// 							</div>
// 						</form>
// 					</section>
// 					<section className="space-y-8">
// 						<ul className="flex flex-col items-center justify-center gap-4 sm:flex-row">
// 							{/* total submissions */}
// 							<div>
// 								{totalSubmissions &&
// 									Object.keys(totalSubmissions).map((userId, idx) => (
// 										<div key={idx}>
// 											<StatBox
// 												title="Total Submissions"
// 												value={totalSubmissions.total_submissions}
// 												// currency="$"
// 												className="w-[225px]"
// 											/>
// 										</div>
// 									))}
// 							</div>
// 							{/* total users */}
// 							<div>
// 								{totalUsers &&
// 									Object.keys(totalUsers).map((userId, idx) => (
// 										<div key={idx}>
// 											<StatBox
// 												title="Total Users"
// 												value={totalUsers.total_users}
// 												// currency="$"
// 												className="w-[225px]"
// 											/>
// 										</div>
// 									))}
// 							</div>

// 							{/* total grants */}
// 							<div>
// 								{[1].map((_, idx) => (
// 									<div key={idx}>
// 										<StatBox
// 											title="Total Grants"
// 											value={0}
// 											currency="$"
// 											className="w-[225px]"
// 										/>
// 									</div>
// 								))}
// 							</div>
// 						</ul>
// 					</section>
// 					<section className="space-y-8">
// 						<div className="flex justify-between items-center">
// 							<div className="">
// 								<h1 className="text-xl font-medium dark:text-white text-dark">
// 									Submissions
// 								</h1>
// 							</div>
// 							<div className="flex items-center gap-1">
// 								<Button className="ghostgray">Weekly</Button>
// 								<Button className="blue">Monthly</Button>
// 								<Button className="ghostgray">Year</Button>
// 								<Button className="ghostgray">Custom Dates</Button>
// 							</div>
// 						</div>
// 						<div className="">
// 							<ChartComponent
// 								options={chartOptions}
// 								series={chartSeries}
// 								type="area"
// 								width="100%"
// 								height="400"
// 							/>
// 						</div>
// 					</section>
// 					<section className="space-y-8">
// 						<ul className="flex items-center justify-center gap-4">
// 							{/* i don`t how i can arrange these boxes based on the design, the in review comes first but here, it is in the middle */}
// 							{projectStatus &&
// 								Object.keys(projectStatus).map((statusKey, idx) => (
// 									<div key={idx}>
// 										<StatBox
// 											title={statusKey}
// 											value={projectStatus[statusKey]}
// 											// currency="$"
// 											className="w-[225px]"
// 										/>
// 									</div>
// 								))}
// 						</ul>
// 					</section>
// 					<section className="space-y-8">
// 						<div className="flex justify-between items-center">
// 							<div className="">
// 								<h1 className="text-xl font-medium dark:text-white text-dark">
// 									Users
// 								</h1>
// 							</div>
// 							<div className="flex items-center gap-1">
// 								<Button className="ghostgray">Weekly</Button>
// 								<Button className="blue">Monthly</Button>
// 								<Button className="ghostgray">Yearly</Button>
// 							</div>
// 						</div>
// 						<div className="">
// 							<ChartComponent
// 								options={chartOptions}
// 								series={chartSeries}
// 								type="area"
// 								width="100%"
// 								height="400"
// 							/>
// 						</div>
// 					</section>
// 					<section className="space-y-8">
// 						<ul className="flex items-center justify-center gap-4">
// 							{[1, 2].map((_, idx) => (
// 								<div key={idx}>
// 									<StatBox
// 										title="Total Submissions"
// 										value={23}
// 										currency="$"
// 										className="w-[225px]"
// 									/>
// 								</div>
// 							))}
// 						</ul>
// 					</section>
// 				</div>
// 			)}

// 			{projectsIsLoading ? (
// 				// Loading state
// 				[1, 2, 3].map((_, index) => (
// 					<div key={index} className="animate-pulse">
// 						{/* Placeholder for loading state */}

// 						<div key={index} className="">
// 							{/* practice */}
// 							<div className="flex  gap-x-6 p-2 items-center animate-pulse  rounded-md bg-gray-100 dark:bg-gray-700">
// 								{/* logo con */}
// 								<div className="animate-pulse bg-gray-300 dark:bg-gray-500 h-[80px] w-[80px] sm:w-[130px] sm:h-[130px]"></div>
// 								{/* project description con */}
// 								<div className="flex flex-col flex-grow gap-y-[20px]">
// 									{/* project title and description div */}
// 									<div>
// 										{/* the project title */}
// 										<div className="animate-pulse h-[28px] w-[115px]  rounded-md bg-gray-300 dark:bg-gray-500"></div>
// 										{/* the project description */}
// 										<div className="animate-pulse h-[28px] w-[115px] mt-[10px]  rounded-md bg-gray-300 dark:bg-gray-500"></div>
// 									</div>
// 									{/* categories */}
// 									<div className="flex items-center gap-x-[20px] ">
// 										<div className="animate-pulse h-[28px] w-[80px] mt-[10px]  rounded-md bg-gray-300 dark:bg-gray-500"></div>
// 										<div className="animate-pulse h-[28px] w-[80px] mt-[10px]  rounded-md bg-gray-300 dark:bg-gray-500"></div>
// 									</div>
// 								</div>
// 								{/* vote button */}
// 								<div className="self-end">
// 									<button className="animate-pulse h-[28px] w-[80px] mt-[10px]  rounded-md bg-gray-300 dark:bg-gray-500"></button>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				))
// 			) : (
// 				// Render actual projects
// 				<div>
// 					<section className="space-y-8">
// 						<h1 className="sm:text-2xl font-bold text-black dark:text-white">
// 							Requests (22)
// 						</h1>

// 						<ul className="space-y-8">
// 							{[1, 2, 3].map((project, id) => (
// 								<div key={id}>
// 									<ProjectComponent
// 										key={id}
// 										imageSrc={'/media/common/img-placeholder.png'}
// 										title={'title'}
// 										description={'description'}
// 										categories={['a', 'b']}
// 										upvotes={100}
// 										onUpvoteClick={() => {}}
// 										onCheckClick={() => {}}
// 									/>
// 								</div>
// 							))}
// 						</ul>
// 					</section>
// 				</div>
// 			)}
// 		</main>
// 	);
// }
