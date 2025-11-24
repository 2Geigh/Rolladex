import "./styles/dist/Navbar.min.css"

const NavbarWithoutLinks = () => {
    return (
        <>
            <nav className="navbar">
                <a href="/home" className="logo">myFriends</a>
                
                <ul className="links">
                    {/* <li><a href="/friends">Friends</a></li>
                    <li><a href="/meetups">Meetups</a></li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/settings">Settings</a></li> */}
                </ul>
            </nav>
        </>
    )
}

export default NavbarWithoutLinks
