import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';

// services
import SettingsService from '@shared/services/settings/settings.service';
import SettingsSvcContext from '@shared/services/settings/settings.context';
import AuthSvcContext from '@shared/services/auth/auth.context';
import ModalSvcContext from '@shared/services/modal/modal.context';
import UserSvcContext from '@shared/services/user/user.context';

// components
import Button from '@components/internal/button/button.component';
import ImagoTipo from '@components/logos/pwr-imagotipo/pwr-imagotipo.logo';

// static
import ROUTES from '@static/router.data';
import APP_MODALS from '@static/enums/app.modals';

const navBttns = [{ label: 'Eventos', href: ROUTES.events.root }];

export default function HeaderComponent() {
	// *~~~ inject dependencies ~~~* //

	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);
	const modalSvc = useContext(ModalSvcContext);
	const settingsSvc = useContext(SettingsSvcContext);

	// const navigate = useNavigate();
	const { pathname } = useLocation();

	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const toggleMobileNav = () => {
		setMobileNavOpen(!mobileNavOpen);
	};

	function toggleTheme() {
		settingsSvc.toggleTheme();
	}

	function openLoginModal() {
		modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
	}

	const [loggingOut, setLoggingOut] = useState(false);

	async function logout() {
		setLoggingOut(true);

		try {
			await authSvc.logout();
		} catch (error) {
			console.error('Error during logout:', error);
		} finally {
			setLoggingOut(false);
			// navigate(ROUTES.root);
		}
	}

	return (
		<nav className="  fixed bg-opacity-5 top-0 left-0 w-full z-header transparent px-4 md:px-[24px] lg:px-[100px] py-5">
			<div className="bg-white dark:bg-dark-800 shadow-md rounded-[30px] px-[50px] h-header">
				{/* desktop */}
				<div className="flex justify-between items-center  w-full h-full ">
					{/* brand */}
					<Link to={ROUTES.root} className="brand">
						<ImagoTipo />
					</Link>

					{/* navbar links */}
					<div className="hidden md:flex items-center gap-x-6 ">
						{/* link con */}
						<ul className="flex items-center gap-x-6">
							{userSvc.isAdmin() && (
								<li>
									<Link
										to={ROUTES.dashboard.root}
										className={`navbar-link ${
											pathname.includes('dashboard') ? 'active' : ''
										}`}
									>
										Dashboard
									</Link>
								</li>
							)}
							{navBttns.map((nav, idx) => (
								<li key={idx}>
									<Link
										to={nav.href}
										className={`navbar-link ${
											pathname.includes(nav.href) ? 'active' : ''
										}`}
									>
										{nav.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* user */}
					<div className="hidden md:flex items-center gap-x-6 ">
						{authSvc.isLoggedIn ? (
							<>
								<Link
									to={ROUTES.profile.root.replace(
										':id',
										userSvc.getUserData().id
									)}
								>
									<img
										src={userSvc.getUserData().pfp}
										alt=""
										className="w-8 h-8 rounded-full hover:scale-110 hover:shadow-lg transition duration-300 ease-in-out"
									/>
								</Link>

								<button
									className={`navbar-link bbttnn  ${loggingOut && 'loading'}`}
									onClick={logout}
								>
									Cerrar sesión
								</button>
							</>
						) : (
							<button className="navbar-link" onClick={openLoginModal}>
								Iniciar sesión
							</button>
						)}

						<button
							className="theme_btn text-agrey-500 dark:text-white"
							onClick={toggleTheme}
						>
							<div className="dark:text-white">
								<i
									className={`fa-if fas fa-${
										settingsSvc.theme === 'light' ? 'moon ' : 'sun-bright'
									}`}
								></i>
							</div>
						</button>

						<Link to={ROUTES.events.create}>
							<Button className="blue small hover:scale-105 transition duration-300 ease-in-out">
								Crear evento
							</Button>
						</Link>
					</div>

					<div className="burger-button md:hidden flex">
						{authSvc.isLoggedIn && (
							<Link to={ROUTES.profile.root.replace(':id', userSvc.getUserData().id)}>
								<img
									src={userSvc.getUserData().pfp}
									alt=""
									className="w-8 h-8 rounded-full mr-4"
								/>
							</Link>
						)}

						{/* This is a simple burger icon. You can replace this with any SVG or icon library you prefer. */}
						<button
							data-collapse-toggle="navbar-sticky"
							type="button"
							className={`burger ${mobileNavOpen ? 'active' : ''}`}
							aria-controls="navbar-sticky"
							aria-expanded="true"
							onClick={toggleMobileNav}
						>
							<div className="h-line h-line1 dark:bg-white"></div>
							<div className="h-line h-line2 dark:bg-white"></div>
							<div className="h-line h-line3 dark:bg-white"></div>
						</button>
					</div>
				</div>

				{/* mobile */}
				<div className="flex justify-center">
					{/* Mobile navigation menu */}
					{mobileNavOpen && (
						<div className="transition-opacity duration-300 ease-in opacity-100 shadow-bottom absolute top-13 mt-[-23px]    w-[92%] rounded-bl-2xl rounded-br-2xl shadow-bl-2xl dark:bg-dark-800 bg-white  p-4 flex flex-col items-center space-y-6">
							{/* links */}
							<div className="space-y-9 mt-5 ">
								<div className="">
									<Link
										to={ROUTES.projects.root}
										className=" justify-center font-medium text-agrey-900 dark:text-white flex items-center gap-x-2 "
									>
										<div>Projects</div>
									</Link>
								</div>
								{/* governance link */}
								<div className="">
									<Link
										to="https://governance.pwrlabs.io/"
										className=" justify-center font-medium text-agrey-900 dark:text-white flex items-center gap-x-2 "
									>
										<div>Governance</div>
									</Link>
								</div>

								{/* staking link */}
								<div className="">
									<Link
										to="https://staking.pwrlabs.io/"
										className=" justify-center font-medium text-agrey-900 dark:text-white flex items-center gap-x-2 "
									>
										<div>Staking</div>
									</Link>
								</div>

								{/* airdrops link */}
								<div className="">
									<Link
										to="https://airdrop.pwrlabs.io/"
										className=" justify-center font-medium text-agrey-900 dark:text-white flex items-center gap-x-2 "
									>
										<div>Airdrops</div>
									</Link>
								</div>

								<div className="">
									<Link
										to="/faq"
										className=" justify-center font-medium text-agrey-900 dark:text-white flex items-center gap-x-2 "
									>
										<div>FAQ</div>
									</Link>
								</div>
							</div>

							{/* buttons */}
							<div className="flex justify-between gap-4 mb-3">
								{/* <Button className="secondary medium w-2/4">Connect</Button> */}

								{authSvc.isLoggedIn ? (
									<>
										<button className="navbar-link" onClick={logout}>
											Log Out
										</button>
									</>
								) : (
									<Button
										className="blue medium w-[117px]"
										onClick={openLoginModal}
									>
										Login
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
