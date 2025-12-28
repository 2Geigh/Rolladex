import { MeetupsSection } from "../Home/MeetupsSection"
import Navbar from "../Navbar/Navbar"
import { useState, useLayoutEffect } from "react"
import { Navigate } from "react-router"
import { RedirectIfSessionInvalid } from "../../contexts/auth"
import { UseAuthContext } from "../../contexts/auth"

const Meetups: React.FC = () => {
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
				<MeetupsSection />
			</div>
		</>
	)
}

export default Meetups
