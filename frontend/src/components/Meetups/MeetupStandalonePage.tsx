import Navbar from "../Navbar/Navbar"
import "./styles/dist/MeetupStandalonePage.min.css"
import Footer from "../Footer/Footer"
import { useLayoutEffect } from "react"
import { RedirectIfSessionInvalid } from "../../contexts/auth"
import { Navigate } from "react-router"
import { UseAuthContext } from "../../contexts/auth"
import type React from "react"

const MeetupStandalonePage: React.FC = () => {
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
			<div className="content">
				{/* <MeetupItem meetup={meetup} friends={friends} /> */}
			</div>
			<Footer />
		</>
	)
}

export default MeetupStandalonePage
