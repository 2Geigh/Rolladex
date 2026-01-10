import "./styles/dist/Navbar.min.css"

type NavbarProps = {
	username: string
}
const Navbar: React.FC<NavbarProps> = ({ username }) => {
	return (
		<>
			<nav className="navbar">
				<a href="/home" className="logo">
					myFriends
				</a>

				<ul className="links">
					<li>
						<a href="/friends?sortby=default&page=1">Friends</a>
					</li>
					<li>
						<a href={`/users/${username}`}>{username}</a>
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
