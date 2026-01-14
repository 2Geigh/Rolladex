import Navbar from "../Navbar/Navbar"
import "./styles/MeetupStandalonePage.css"
import Footer from "../Footer/Footer"
import type React from "react"

const MeetupStandalonePage: React.FC = () => {
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
