import Navbar from "../Navbar/Navbar"
import { useLoginSessionContext } from "../../contexts/LoginSession"

const Profile: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()

	return (
		<>
			<Navbar username={loginSessionContext.user?.username} />
			<div className="content">
				Hello, {loginSessionContext.user?.username}
			</div>
		</>
	)
}

export default Profile
