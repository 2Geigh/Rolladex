import "./styles/dist/Home.min.css"
import Navbar from "../Navbar/Navbar"
import FriendsSection from "./FriendsSection"
import { MeetupsSection } from "./MeetupsSection"
import Footer from "../Footer/Footer"
import { RedirectIfSessionInvalid, type SessionProps } from "../../util/auth"
import { useLayoutEffect, useState } from "react"
import { Navigate } from "react-router"

type HomeProps = SessionProps

const Home: React.FC<HomeProps> = ({ isSessionValid, setIsSessionValid }) => {
	// Validate login session before component renders
	const [redirectToLogin, setRedirectToLogin] = useState(false)
	useLayoutEffect(() => {
		RedirectIfSessionInvalid(
			isSessionValid,
			setIsSessionValid,
			setRedirectToLogin,
		)
	}, [isSessionValid, setIsSessionValid])
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
