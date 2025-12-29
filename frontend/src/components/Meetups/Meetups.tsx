import { MeetupsSection } from "../Home/MeetupsSection"
import Navbar from "../Navbar/Navbar"
import { useLayoutEffect } from "react"
import { Navigate } from "react-router-dom"
import Loading from "../Loading/Loading"
import { useState } from "react"
import { IsLoginSessionValid } from "../../contexts/auth"

const Meetups: React.FC = () => {
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
				<MeetupsSection />
			</div>
		</>
	)
}

export default Meetups
