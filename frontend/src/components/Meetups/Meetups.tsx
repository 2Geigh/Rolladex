import { MeetupsSection } from "../Home/MeetupsSection"
import Navbar from "../Navbar/Navbar"
import { useState, useLayoutEffect } from "react"
import { Navigate } from "react-router"
import { RedirectIfSessionInvalid, type SessionProps } from "../../util/auth"

type MeetupsProps = SessionProps

const Meetups: React.FC<MeetupsProps> = ({
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
			<div className="content">
				<MeetupsSection />
			</div>
		</>
	)
}

export default Meetups
