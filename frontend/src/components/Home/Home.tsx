import "./styles/dist/Home.min.css"
import Navbar from "../Navbar/Navbar"
import FriendsSection from "./FriendsSection"
import { MeetupsSection } from "./MeetupsSection"
import Footer from "../Footer/Footer"
import { useLayoutEffect, useState } from "react"
import { Navigate } from "react-router"
import { RedirectIfSessionInvalid, UseAuthContext } from "../../contexts/auth"

const Home: React.FC = () => {
	// Validate login session before component renders
	const authContext = UseAuthContext()
	const [redirectToLogin, setRedirectToLogin] = useState(false)
	useLayoutEffect(() => {
		RedirectIfSessionInvalid(
			authContext.isSessionValid,
			authContext.setIsSessionValid,
			setRedirectToLogin,
		)
	}, [authContext.isSessionValid, authContext.setIsSessionValid])
	if (redirectToLogin) {
		return <Navigate to="/login" />
	}

	return (
		<>
			<Navbar />

			<div className="content">
				<FriendsSection />
				<MeetupsSection />
			</div>

			<Footer />
		</>
	)
}

export default Home
