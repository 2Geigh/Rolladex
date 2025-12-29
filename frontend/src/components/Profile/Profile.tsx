import Navbar from "../Navbar/Navbar"
import { Navigate } from "react-router"
import { useLayoutEffect } from "react"
import { RedirectIfSessionInvalid } from "../../contexts/auth"
import { UseAuthContext } from "../../contexts/auth"

const Profile: React.FC = () => {
	// Validate login session before component renders
	const authContext = UseAuthContext()
	useLayoutEffect(() => {
		RedirectIfSessionInvalid(
			authContext.isSessionValid,
			authContext.setIsSessionValid,
		)
	}, [authContext.isSessionValid, authContext.setIsSessionValid])
	if (!authContext.isSessionValid) {
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
