import "./styles/dist/Home.min.css"
import Navbar from "../Navbar/Navbar"
import FriendsSection from "./FriendsSection"
import { MeetupsSection } from "./MeetupsSection"
import Footer from "../Footer/Footer"
import { useLayoutEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { IsLoginSessionValid } from "../../contexts/auth"
import Loading from "../Loading/Loading"

const Home: React.FC = () => {
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
				<FriendsSection />
				<MeetupsSection />
			</div>

			<Footer />
		</>
	)
}

export default Home
