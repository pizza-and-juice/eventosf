// react
import { useRef, useState } from 'react';
import useOutsideHandler from 'src/shared/hooks/click-outside.hook';

type Options = {
	id: number;
	label: string;
	value: string;
};

type NormalDropdownProps = {
	className: string;
	options: Options[];
	optionComponent?: any;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 *
 * @param {options} -> {id: number, label: string, value: string, ...rest}
 * @returns a dropdown component
 */

function defaultOption({ item }: { item: any }) {
	return <div>{item.label}</div>;
}

export default function NormalDropdown({
	className = '',
	options,
	optionComponent: Option = defaultOption,
	...rest
}: NormalDropdownProps) {
	const selectRef = useRef<HTMLSelectElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	const { value, disabled } = rest;

	useOutsideHandler(dropdownRef, () => {
		setIsOpen(false);
	});

	function handleOptionClick(option: any) {
		// programatically select the option for the native select element
		// and dispatch a change event
		selectRef.current!.value = option.value;

		const event = new Event('change', { bubbles: true });
		selectRef.current!.dispatchEvent(event);

		setIsOpen(false);
	}

	function toggle() {
		setIsOpen(!isOpen);
	}

	const selectedOption = options.find((option) => option.value === value);

	return (
		<div className="dropdown-c relative space-y-2" ref={dropdownRef}>
			{/* HIDDEN NATIVE SELECT */}
			<select className="hidden" {...rest} ref={selectRef}>
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
				className={`dropdown_button colors flex justify-between items-center ${className}`}
				type="button"
				disabled={disabled}
			>
				<div>{selectedOption ? <Option item={selectedOption} /> : 'Select'}</div>
				<h6 className="text-agrey-500 dark:text-agrey-600">
					<i className={`fa-lg fa-solid fa-angle-${isOpen ? 'up' : 'down'} `} />
				</h6>
			</button>

			{isOpen && (
				<ul className="shadow_dropdown rounded-xl bg-white dark:bg-abrandc-dark-blackish absolute top-11 left-0 w-full overflow-hidden z-[2]">
					<div className="max-h-[200px] overflow-y-auto scroll scroll-sm ">
						{options.map((option) => (
							<li key={option.id} onClick={() => handleOptionClick(option)}>
								<button
									type="button"
									className={`dropdown_option ${
										value === option.value ? 'active' : ''
									}`}
								>
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
