{
	/* Search Bar */
}
<section>
	<form onSubmit={handleSubmit}>
		<div className="field">
			<div className="form-control">
				<input
					className="text-field pr-20 pl-9"
					type="text"
					{...getFieldProps('search')}
					placeholder="Search projects"
				/>

				{/* icon */}
				<div className="text-black dark:text-white absolute inset-y-0 left-0 flex items-center pl-3 ">
					<i className="fa-solid fa-magnifying-glass"></i>
				</div>

				<div className="absolute inset-y-0 right-0 flex items-center gap-x-2 pr-3">
					{formik.values.search.length > 0 && (
						<button
							type="button"
							className="text-light-600  dark:text-dark-500 hover:text-ablue-200"
							onClick={deleteResults}
						>
							<i className="fa-solid fa-xmark"></i>
						</button>
					)}
					{/* enter button */}
					<button type="submit">
						<div className="flex justify-center items-center gap-x-2 text-light-600  dark:text-dark-500 hover:text-ablue-200">
							<i className="fa-solid fa-arrow-turn-down-right"></i>
							<h2>Enter</h2>
						</div>
					</button>
				</div>

				{/* Dropdown for search results  */}
				{searchProjectMutation.isLoading ? (
					<ul className="absolute w-full top-full translate-y-2 dropdown-menu   bg-light-800 dark:bg-dark-800 z-searchPanel overflow-hidden rounded-xl py-2 max-h-[240px] overflow-y-scroll  shadow-xl">
						{[1, 2, 3].map((_, idx) => (
							<li className="" key={idx}>
								<div className="skeleton-container flex p-3 gap-x-2 hover:bg-light-400 dark:hover:bg-dark-400">
									<div className="skeleton-box w-14 h-14" />
									<div className=" space-y-4">
										<h1 className="skeleton-title w-[120px]"></h1>
										<div className="flex gap-x-2">
											<h1 className="skeleton-line w-[50px]"></h1>
											<h1 className="skeleton-line w-[50px]"></h1>
											<h1 className="skeleton-line w-[50px]"></h1>
										</div>
									</div>
								</div>
							</li>
						))}{' '}
					</ul>
				) : formik.values.search.length > 0 && searchResults.length === 0 ? (
					<div className="p-3 absolute w-full top-full translate-y-2 dropdown-menu   bg-light-800 dark:bg-dark-800 z-searchPanel overflow-hidden rounded-xl py-2 max-h-[240px] shadow-xl">
						<h1 className="text-agrey-900 dark:text-white">No results found</h1>
					</div>
				) : (
					searchResults.length > 0 && (
						<ul className="absolute w-full top-full translate-y-2 dropdown-menu   bg-light-800 dark:bg-dark-800 z-searchPanel overflow-hidden rounded-xl py-2 max-h-[240px] overflow-y-scroll  shadow-xl">
							{searchResults.map((_, idx) => (
								<li key={idx}>
									<Link
										to={ROUTES.projects.details.replace(/:id/, _.id.toString())}
									>
										<div className="flex p-3 gap-x-2 hover:bg-light-400 dark:hover:bg-dark-400">
											<img src={_.logoPath} alt="" className="w-14 h-14" />

											<div>
												<h1 className="text-black dark:text-white">
													{_.projectName}
												</h1>

												<div className="flex gap-x-2 ">
													{_.categories.map((category, index) => (
														<Tag key={index}>{category}</Tag>
													))}
												</div>
											</div>
										</div>
									</Link>
								</li>
							))}
						</ul>
					)
				)}
			</div>
		</div>
	</form>
</section>;
