import type React from 'react';
import './styles/Navbar.scss';
import '../../../public/images/Hamburger_icon.svg';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

type NavbarProps = {
	isLoggedIn: boolean;
	username: string | undefined;
};

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
	function toggleMobileNavVisibiity(event: React.MouseEvent<HTMLDivElement>) {
		event.preventDefault();

		const mobileNav = document.getElementById('mobileNav')!;
		const toggleIcon = document.getElementById('hamburgerIcon')!;

		if (mobileNav.style.display === 'none') {
			mobileNav.style.display = '';
			toggleIcon.innerText = '🗙';
		} else {
			mobileNav.style.display = 'none';
			toggleIcon.innerText = '☰';
		}
	}

	useEffect(() => {
		const mobileNav = document.getElementById('mobileNav');

		if (mobileNav) {
			mobileNav.style.display = 'none';
		}
	}, []);

	const location = useLocation();

	return (
		<nav className='navbar'>
			<Link
				to={
					(
						location.pathname === '/login' ||
						location.pathname === '/'
					) ?
						'/'
					:	'/home'
				}
				className='logo'
			>
				Rolladex
			</Link>

			{location.pathname === '/' && (
				<Link id='openRolladex' to={`/login`}>
					Open Rolladex
				</Link>
			)}

			{isLoggedIn ?
				<>
					<div id='burgerAndMobileNav'>
						<div
							id='hamburgerIcon'
							onClick={toggleMobileNavVisibiity}
						>
							☰
						</div>
						<nav id='mobileNav'>
							<Link to={'home'}>Home</Link>

							<Link to={'/logout'}>Logout</Link>
						</nav>
					</div>
					<nav id='desktopNav'>
						<Link
							to={
								'/friends?sortby=default&page=1&perpage=default'
							}
						>
							Network
						</Link>
						<Link to={'/logout'}>Logout</Link>
					</nav>
				</>
			:	<></>}
		</nav>
	);
};

export default Navbar;
