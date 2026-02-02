import type React from "react"
import "./styles/Navbar.css"
import "../../../static/images/Hamburger_icon.svg"
import { useEffect } from "react"

type NavbarProps = {
	isLoggedIn: boolean
	username: string | undefined
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
	function toggleMobileNavVisibiity(event: React.MouseEvent<HTMLDivElement>) {
		event.preventDefault()

		const mobileNav = document.getElementById("mobileNav")!
		const toggleIcon = document.getElementById("hamburgerIcon")!

		if (mobileNav.style.display === "none") {
			mobileNav.style.display = ""
			toggleIcon.innerText = "🗙"
		} else {
			mobileNav.style.display = "none"
			toggleIcon.innerText = "☰"
		}
	}

	useEffect(() => {
		const mobileNav = document.getElementById("mobileNav")

		if (mobileNav) {
			mobileNav.style.display = "none"
		}
	}, [])

	return (
		<>
			{isLoggedIn ?
				<nav className="navbar">
					<a href="/home" className="logo">
						Rolladex
					</a>

					<>
						<div id="burgerAndMobileNav">
							<div
								id="hamburgerIcon"
								onClick={toggleMobileNavVisibiity}
							>
								☰
							</div>
							<nav id="mobileNav">
								<a href="/home">Home</a>
								<a href="/friends?sortby=default&page=1&perpage=default">
									Network
								</a>
								<a href="/logout">Logout</a>
							</nav>
						</div>
						<nav id="desktopNav">
							<a href="/friends?sortby=default&page=1&perpage=default">
								Network
							</a>
							<a href="/logout">Logout</a>
						</nav>
					</>
				</nav>
			:	<>
					<nav className="navbar"></nav>
				</>
			}
		</>
	)
}

export default Navbar
