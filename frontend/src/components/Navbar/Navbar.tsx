import "./styles/Navbar.css"

type NavbarProps = {
	isLoggedIn: boolean
	username: string | undefined
}
const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, username }) => {
	return (
		<>
			<nav className="navbar">
				<a href={!isLoggedIn ? "/" : "/home"} className="logo">
					justConnect
				</a>

				{isLoggedIn ?
					<ul className="links">
						<li>
							<a href="/friends?sortby=default&page=1&perpage=default">
								Network
							</a>
						</li>
						{username && (
							<li>
								<a href="/profile">{username}</a>
							</li>
						)}
						<li>
							<a href="/logout">Logout</a>
						</li>
					</ul>
				:	<></>}
			</nav>
		</>
	)
}

export default Navbar
