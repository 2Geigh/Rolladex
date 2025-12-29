import Navbar from "../Navbar/Navbar"
import { Navigate } from "react-router-dom"
import { useLayoutEffect } from "react"
import { useState } from "react"
import { IsLoginSessionValid } from "../../contexts/auth"
import Loading from "../Loading/Loading"

const Profile: React.FC = () => {
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
			<div className="content">This is the Profile Component.</div>
		</>
	)
}

export default Profile
