import { useState, useLayoutEffect } from "react"
import Navbar from "../Navbar/Navbar"
import { RedirectIfSessionInvalid } from "../../contexts/auth"
import { Navigate } from "react-router"
import { UseAuthContext } from "../../contexts/auth"

const Settings: React.FC = () => {
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
			<div className="content">This is the Settings Component.</div>
		</>
	)
}

export default Settings
