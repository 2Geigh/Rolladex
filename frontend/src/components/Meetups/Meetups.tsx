import { useLoginSessionContext } from "../../contexts/LoginSession"
import { MeetupsSection } from "../Home/MeetupsSection"
import Navbar from "../Navbar/Navbar"

const Meetups: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()

	return (
		<>
			<Navbar username={loginSessionContext.user?.username} />
			<div className="content">
				<MeetupsSection />
			</div>
		</>
	)
}

export default Meetups
