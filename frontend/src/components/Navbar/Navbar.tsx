import type React from "react"
import "./styles/Navbar.css"
import "../../../static/images/Hamburger_icon.svg"
import { useEffect } from "react"

type NavbarProps = {
	isLoggedIn: boolean
	username: string | undefined
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, username }) => {



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
			<nav className="navbar">
				<a href={!isLoggedIn ? "/" : "/home"} className="logo">
					Rolladex
				</a>

				{isLoggedIn &&

					<>
						<div id="burgerAndMobileNav">
							<div id="hamburgerIcon" onClick={toggleMobileNavVisibiity}>☰</div>
							<nav id="mobileNav">
								<a href="/home">
									Home
								</a>
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
					</>}
			</nav>
		</>
	)
}

export default Navbar
