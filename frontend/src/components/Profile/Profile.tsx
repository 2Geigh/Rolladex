import Navbar from "../Navbar/Navbar"
import { useUserContext } from "../../contexts/auth"

const Profile: React.FC = () => {
	const user = useUserContext()

	return (
		<>
			<Navbar />
			<div className="content">Hello, {user?.username}</div>
		</>
	)
}

export default Profile
