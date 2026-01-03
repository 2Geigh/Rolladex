import "./styles/dist/Home.min.css"
import Navbar from "../Navbar/Navbar"
import { ToContactSection } from "./ToContactSection"
import { MeetupsSection } from "./MeetupsSection"
import Footer from "../Footer/Footer"
import type React from "react"

const Home: React.FC = () => {
	return (
		<>
			<Navbar />

			<div className="content">
				<ToContactSection />
				<MeetupsSection />
			</div>

			<Footer />
		</>
	)
}

export default Home
