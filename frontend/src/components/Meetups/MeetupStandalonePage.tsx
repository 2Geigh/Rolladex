import Navbar from "../Navbar/Navbar"
import "./styles/dist/MeetupStandalonePage.min.css"
import Footer from "../Footer/Footer"
import { useLayoutEffect } from "react"
import { Navigate } from "react-router-dom"
import type React from "react"
import { IsLoginSessionValid } from "../../contexts/auth"
import { useState } from "react"
import Loading from "../Loading/Loading"

const MeetupStandalonePage: React.FC = () => {
	// Auth guard
	const [isLoginSessionValid, setIsLoginSessionValid] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	useLayoutEffect(() => {
		IsLoginSessionValid()
			.then((isValid) => {
				setIsLoginSessionValid(isValid)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])
	if (isLoading) {
		return <Loading />
	}
	if (!isLoginSessionValid) {
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
