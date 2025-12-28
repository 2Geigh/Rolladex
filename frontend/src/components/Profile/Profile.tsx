import Navbar from "../Navbar/Navbar"
import { Navigate } from "react-router"
import { useState, useLayoutEffect } from "react"
import { RedirectIfSessionInvalid } from "../../contexts/auth"
import { UseAuthContext } from "../../contexts/auth"

const Profile: React.FC = () => {
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
			<div className="content">This is the Profile Component.</div>
		</>
	)
}

export default Profile
