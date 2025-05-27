// react
import { useState } from 'react';

// scss
import './search-bar-dropdown.component.scss';
import 'src/components/internal/checkbox/checkbox.scss';
import '../text-field/search-input.scss';

type Options = {
	id: number;
	label: string;
	value: string;
	image?: string;
};

type NormalDropdownProps = {
	name: string;
	value: string;
	onChange: (event: any) => void;
	onBlur?: (event: any) => void;
	options: Options[];
	optionComponent?: any;
	optionComponent2?: any;
	w_image: boolean;
};

/**
 *
 * @param {options} -> {id: number, label: string, value: string, ...rest}
 * @returns a dropdown component
 */

function defaultOption({ item }: { item: any }) {
	return (
		<div className="flex flex-col">
			<h2 className="h-[18px] font-medium dark:text-white text-black">{item.label}</h2>
			<h2 className="h-[18px] text-agrey-700 dark:text-light-600">{item.label}</h2>
		</div>
	);
}

function defaultOption2({ item }: { item: any }) {
	return <div>{item.label}</div>;
}

export default function SearchBarDropdown({
	name = '',
	value = '',
	onChange = () => {},
	onBlur = () => {},
	options,
	optionComponent: Option = defaultOption,
	optionComponent2: Option2 = defaultOption2,
	w_image,
}: NormalDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);

	function handleOptionClick(option: any) {
		const changeEvent = {
			target: {
				name,
				value: option.value,
			},
		};
		onChange(changeEvent);
		setIsOpen(false);
	}

	function toggle() {
		setIsOpen(!isOpen);
		onBlur({ target: { name } });
	}

	const selectedOption = options.find((option) => option.value === value);

	const [searchValue, setSearchValue] = useState<string>('');

	const [validOptions, setValidOptions] = useState<Options[]>(options);

	const filterBySearch = (e: any) => {
		const inputValue = e.target.value.toLowerCase();
		setSearchValue(inputValue);

		const filteredOptions = options.filter((option) =>
			option.label.toLowerCase().includes(inputValue)
		);

		setValidOptions(filteredOptions);
	};

	return (
		<div className="dropdown-c relative space-y-2">
			{/* HIDDEN NATIVE SELECT */}
			<select
				className="hidden"
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			>
				<option value=""></option>
				{options.map((option, idx) => (
					<option key={idx} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			{/* DROPDOWN BUTTON */}
			<button
				onClick={toggle}
				className="search_dropdown_button colors flex justify-between items-center"
				type="button"
			>
				<div>{selectedOption ? <Option2 item={selectedOption} /> : 'Select'}</div>
				<h6 className="text-agrey-500 dark:text-agrey-600">
					<i className={`fa-lg fa-solid fa-angle-${isOpen ? 'up' : 'down'} `} />
				</h6>
			</button>

			{isOpen && (
				<ul className="shadow_dropdown rounded-xl bg-white dark:bg-abrandc-dark-blackish absolute top-11 left-0 w-full overflow-hidden">
					<div className="max-h-[400px] overflow-y-auto scroll scroll-xs scroll-mx-80 dark:bg-dark-500">
						<div className="mx-2 mt-2 mb-1 relative">
							<input
								className="search-input !h-[32px] !rounded-lg !pl-10"
								placeholder="Search"
								onChange={(e) => filterBySearch(e)}
								value={searchValue}
							/>
							<i className="fas fa-search absolute dark:text-white left-0 top-2.5 left-4"></i>
						</div>
						{validOptions.map((option) => (
							<li key={option.id} onClick={() => handleOptionClick(option)}>
								<button
									className={`search_dropdown_option ${
										value === option.value ? 'active' : ''
									}`}
								>
									{w_image && (
										<img
											className="rounded-full overflow-hidden bg-agrey-50 w-[24px] h-[24px] bg-ghostly_grey-200"
											src={option.image}
										/>
									)}
									<Option item={option} />
								</button>
							</li>
						))}
					</div>
				</ul>
			)}
		</div>
	);
}
