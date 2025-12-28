import { useState, useLayoutEffect } from "react"
import Navbar from "../Navbar/Navbar"
import { RedirectIfSessionInvalid } from "../../util/auth"
import { Navigate } from "react-router"
import type { SessionProps } from "../../util/auth"

type SettingsProps = SessionProps

const Settings: React.FC<SettingsProps> = ({
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
			<div className="content">This is the Settings Component.</div>
		</>
	)
}

export default Settings
