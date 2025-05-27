import { useState } from 'react';

import {
	Placement,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	flip,
} from '@floating-ui/react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
	return new Date(year, month, 1).getDay();
}

type CalendarProps = {
	children: React.ReactNode;
	onDateSelect?: (date: Date) => void; // Optional callback for date selection
	defaultDate?: Date; // Optional default date
	placement?: Placement; // Optional placement for the calendar
};

enum CalendarTab {
	Day = 'day',
	Month = 'month',
	Year = 'year',
}

export default function CustomDatePicker({
	children,
	onDateSelect,
	placement,
	defaultDate,
}: CalendarProps) {
	// #region constants

	const MAX_YEAR = 2100;
	const MIN_YEAR = 1900;

	// #endregion

	// #region internal state
	const [selectedTab, setSelectedTab] = useState<CalendarTab>(CalendarTab.Day);

	const _date = defaultDate ?? new Date();
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [currentMonth, setCurrentMonth] = useState(_date.getMonth());
	const [currentYear, setCurrentYear] = useState(_date.getFullYear());
	// #endregion

	// #region floating ui

	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		placement: placement ?? 'bottom-end',
		open: isCalendarOpen,
		onOpenChange: setIsCalendarOpen,
		middleware: [offset(5), flip(), shift()],
	});

	const click = useClick(context);
	const dismiss = useDismiss(context, {
		escapeKey: true,
	});

	const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

	// #endregion

	// #region fn

	// --- toggle calendar open/close

	function toggleCalendar() {
		setIsCalendarOpen((prev) => !prev);
	}

	// function openCalendar() {
	// 	setIsCalendarOpen(true);
	// }

	// function closeCalendar() {
	// 	setIsCalendarOpen(false);
	// 	setSelectedTab(CalendarTab.Day);
	// }

	// --- select tabs

	function selectDayTab() {
		setSelectedTab(CalendarTab.Day);
	}

	function selectMonthTab() {
		setSelectedTab(CalendarTab.Month);
	}

	function selectYearTab() {
		setSelectedTab(CalendarTab.Year);
	}

	// --- handle date change

	function handleDateClick(day: number) {
		const date = new Date(currentYear, currentMonth, day);
		setSelectedDate(date);
		onDateSelect && onDateSelect(date); // Call the callback
		selectDayTab();
	}

	function handleMonthSelect(month: number) {
		setCurrentMonth(month);
		selectDayTab();
	}

	function handleYearSelect(year: number) {
		setCurrentYear(year);
		selectMonthTab();
	}

	// --- handle top bar arrows

	function prevYear() {
		if (currentYear === MIN_YEAR) {
			return;
		}

		setCurrentYear((prev) => prev - 1);
	}

	function nextYear() {
		if (currentYear === MAX_YEAR) {
			return;
		}

		setCurrentYear((prev) => prev + 1);
	}

	const prevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear((prev) => prev - 1);
		} else {
			setCurrentMonth((prev) => prev - 1);
		}
	};

	const nextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear((prev) => prev + 1);
		} else {
			setCurrentMonth((prev) => prev + 1);
		}
	};
	// #endregion

	const daysInMonth = getDaysInMonth(currentYear, currentMonth);
	const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

	const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i);

	return (
		<div className="relative ">
			{/* button */}
			<div
				className="w-fit"
				ref={refs.setReference}
				{...getReferenceProps()}
				onClick={toggleCalendar}
			>
				{children}
			</div>

			{/* floating element */}
			{isCalendarOpen && (
				<div ref={refs.setFloating} {...getFloatingProps()} style={floatingStyles}>
					<div className=" z-10 mt-2 w-72 bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-400 rounded-lg shadow-lg p-4">
						{/* Top Bar */}
						<div className="flex items-center justify-between mb-2">
							{selectedTab === CalendarTab.Day && (
								<>
									<button
										onClick={prevMonth}
										className="text-agrey-700 dark:text-agrey-400 hover:text-black dark:hover:text-white"
									>
										<i className="fa-solid fa-chevron-left fa-xs"></i>
									</button>

									<button
										className="font-medium cursor-pointer text-agrey-700 dark:text-agrey-400 hover:text-black dark:hover:text-white"
										onClick={selectMonthTab}
									>
										<span>
											{months[currentMonth]} {currentYear}
										</span>
									</button>

									<button
										onClick={nextMonth}
										className="text-agrey-700 dark:text-agrey-400 hover:text-black dark:hover:text-white"
									>
										<i className="fa-solid fa-chevron-right fa-xs"></i>
									</button>
								</>
							)}

							{selectedTab === CalendarTab.Month && (
								<>
									<button
										onClick={prevYear}
										className="text-agrey-700 dark:text-agrey-400 hover:text-black dark:hover:text-white disabled:opacity-25 disabled:pointer-events-none"
										disabled={currentYear === MIN_YEAR}
									>
										<i className="fa-solid fa-chevron-left fa-xs"></i>
									</button>
									<button
										className="font-medium cursor-pointer text-agrey-700 dark:text-agrey-400 "
										onClick={selectYearTab}
									>
										{currentYear}
									</button>
									<button
										onClick={nextYear}
										className="text-agrey-700 dark:text-agrey-400 hover:text-black dark:hover:text-white disabled:opacity-25 disabled:pointer-events-none"
										disabled={currentYear === MAX_YEAR}
									>
										<i className="fa-solid fa-chevron-right fa-xs"></i>
									</button>
								</>
							)}

							{selectedTab === CalendarTab.Year && (
								<div className="w-full text-center font-medium text-agrey-700 dark:text-agrey-400 ">
									Pick a year
								</div>
							)}
						</div>

						<div className="h-4"></div>

						{/* Content */}
						{selectedTab === CalendarTab.Day && (
							<>
								<div className="grid grid-cols-7 text-xs text-center text-agrey-500 dark:text-agrey-600">
									{daysOfWeek.map((day) => (
										<div key={day}>{day}</div>
									))}
								</div>
								<div className="h-4"></div>
								<div className="grid grid-cols-7 text-center text-sm gap-x-2 gap-y-3">
									{Array.from({ length: firstDay }).map((_, i) => (
										<div key={`empty-${i}`} />
									))}
									{Array.from({ length: daysInMonth }).map((_, i) => {
										const day = i + 1;
										const isSelected =
											selectedDate &&
											selectedDate.getDate() === day &&
											selectedDate.getMonth() === currentMonth &&
											selectedDate.getFullYear() === currentYear;

										return (
											<button
												key={day}
												onClick={() => handleDateClick(day)}
												className={`py-1 rounded-lg ${
													isSelected
														? 'bg-blue-500 text-white'
														: 'text-agrey-700 dark:text-agrey-400 hover:bg-light-500 dark:hover:bg-dark-700 dark:hover:text-white'
												}`}
											>
												{day}
											</button>
										);
									})}
								</div>
							</>
						)}

						{selectedTab === CalendarTab.Month && (
							<div className="grid grid-cols-4 gap-2 text-center text-sm">
								{months.map((month, idx) => (
									<button
										key={idx}
										onClick={handleMonthSelect.bind(null, idx)}
										className="py-2 rounded-lg text-agrey-700 dark:text-agrey-400 hover:bg-light-500 dark:hover:bg-dark-700 dark:hover:text-white"
									>
										{month.slice(0, 3)}
									</button>
								))}
							</div>
						)}

						{selectedTab === CalendarTab.Year && (
							<div className="h-64 overflow-y-scroll grid grid-cols-4 gap-2 text-sm text-center ">
								{years.map((year) => (
									<button
										key={year}
										onClick={handleYearSelect.bind(null, year)}
										className={`py-2 rounded-lg   ${
											year === currentYear
												? 'bg-blue-500 text-white hover:bg-auto'
												: ' text-agrey-700 dark:text-agrey-400 hover:bg-light-500 dark:hover:bg-dark-700 dark:hover:text-white'
										}`}
									>
										{year}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
