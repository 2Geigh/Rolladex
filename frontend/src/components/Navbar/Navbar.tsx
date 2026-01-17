import "./styles/Navbar.css"

type NavbarProps = {
	username: string | undefined
}
const Navbar: React.FC<NavbarProps> = ({ username }) => {
	return (
		<>
			<nav className="navbar">
				<a href="/home" className="logo">
					justConnect
				</a>

				<ul className="links">
					<li>
						<a href="/friends?sortby=default&page=1">Network</a>
					</li>
					{username && (
						<li>
							<a href={`/users/${username}`}>{username}</a>
						</li>
					)}
					<li>
						<a href="/logout">Logout</a>
					</li>
				</ul>
			</nav>
		</>
	)
}

export default Navbar
