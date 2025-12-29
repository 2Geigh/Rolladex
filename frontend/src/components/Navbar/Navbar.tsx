import "./styles/dist/Navbar.min.css"

const Navbar = () => {
	return (
		<>
			<nav className="navbar">
				<a href="/home" className="logo">
					myFriends
				</a>

				<ul className="links">
					<li>
						<a href="/home">Home</a>
					</li>
					<li>
						<a href="/friends">Friends</a>
					</li>
					<li>
						<a href="/meetups">Meetups</a>
					</li>
					<li>
						<a href="/profile">Profile</a>
					</li>
					<li>
						<a href="/settings">Settings</a>
					</li>
					<li>
						<a href="/logout">Logout</a>
					</li>
				</ul>
			</nav>
		</>
	)
}

export default Navbar
