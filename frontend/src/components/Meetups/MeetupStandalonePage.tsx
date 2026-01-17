import Navbar from "../Navbar/Navbar"
import "./styles/MeetupStandalonePage.css"
import Footer from "../Footer/Footer"
import type React from "react"
import { useLoginSessionContext } from "../../contexts/LoginSession"

const MeetupStandalonePage: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()

	return (
		<>
			<Navbar username={loginSessionContext.user?.username} />
			<div className="content">
				{/* <MeetupItem meetup={meetup} friends={friends} /> */}
			</div>
			<Footer />
		</>
	)
}

export default MeetupStandalonePage
