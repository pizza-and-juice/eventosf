import { useEffect, useRef } from 'react';
import Button from 'src/components/internal/button/button.component';

export default function LoginModalPage() {
	const googleBtn = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!googleBtn.current) return;

		window.google.accounts.id.renderButton(
			googleBtn.current,
			{ theme: 'outline', size: 'large' } // Customize the button as needed
		);

	}, [googleBtn]);
	return (
		<section className="container-2 mx-auto h-screen overflow-scroll">
			<div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 ">
				{/* items gen con */}
				<div className="bg-white dark:bg-abrandc-dark-bgblack rounded-[24px] shadow-boxShadow-2xl w-[90vw] mt-[-300px] md:w-[50vw] lg:w-[30vw] max-w-[406px] p-[32px] pt-[24px] overflow-auto">
					{/* login and hide icon */}
					<div className="flex justify-between items-center pb-[24px]">
						<h3 className="text-[24px] font-bold leading-[36px] dark:text-white">
							Log In
						</h3>
						{/* the hide icon div */}
						<div className="text-black cursor-pointer dark:text-white">
							<i className="fa-regular fa-xmark"></i>
						</div>
					</div>
					{/* text con */}
					<div className="mb-[24px]">
						<h4 className="text-[16px] leading-[26px] font-normal dark:text-white">
							Welcome to the PWR Community! Login/signup to <br /> discover projects
							and apply for grants.
						</h4>
					</div>

					{/* buttons gen con */}
					<div className="flex flex-col items-center gap-[12px]  md:w-[406px] lg:h-[168px]">
						<Button className="blue pt-[8px] pb-[8px] pl-[24px] pr-[24px] h-[48px] w-[236px] md:w-[406px] bg-ablue-1000 text-[14px] leading-[24px] text-white font-normal   md:large ">
							<span>
								<img src="src/assets/pwr.svg" className="inline mr-[8px]" alt="" />
							</span>
							Log in with PWR Wallet
						</Button>

						<div className="g_id_signin" data-type="standard" ref={googleBtn}></div>
						
						<Button className=" pt-[8px] pb-[8px] pl-[24px] pr-[24px] h-[48px] w-[236px] md:w-[406px]  border border-agrey-900   lg:text-abrandc-dark-black text-center md:text-left  dark:text-white  dark:border-agrey-50">
							<span>
								<img
									src="src/assets/google.svg"
									className="inline mr-[8px]"
									alt=""
								/>
							</span>{' '}
							Log in with Google
						</Button>
						<Button className=" pt-[8px] pb-[8px] pl-[24px] pr-[24px] h-[48px] w-[236px] md:w-[406px]  border border-agrey-900 text-center md:text-left dark:text-white  dark:border-agrey-50">
							{/* i tried to use the ghostgray class for each of the last two buttons but i am getting a different background color */}
							<span>
								<img
									src="src/assets/Frame.svg"
									className="inline mr-[8px] dark:hidden"
									alt=""
								/>
								<img
									src="src/assets/Framedark.svg"
									className="inline mr-[8px] hidden dark:inline"
									alt=""
								/>
							</span>{' '}
							Log in with Twitter
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

// 	);
// }
