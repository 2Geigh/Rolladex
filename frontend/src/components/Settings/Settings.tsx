import { useLoginSessionContext } from "../../contexts/LoginSession"
import Navbar from "../Navbar/Navbar"

const Settings: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()

	return (
		<>
			<Navbar username={loginSessionContext.user?.username} />
			<div className="content">This is the Settings Component.</div>
		</>
	)
}

export default Settings
