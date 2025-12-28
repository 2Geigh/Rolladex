import Navbar from "../Navbar/Navbar"
import { Navigate } from "react-router"
import { useState, useLayoutEffect } from "react"
import { RedirectIfSessionInvalid } from "../../util/auth"
import type { SessionProps } from "../../util/auth"

type ProfileProps = SessionProps

const Profile: React.FC<ProfileProps> = ({
	isSessionValid,
	setIsSessionValid,
}) => {
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
			<div className="content">This is the Profile Component.</div>
		</>
	)
}

export default Profile
