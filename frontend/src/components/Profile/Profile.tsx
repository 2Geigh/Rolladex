import { useLoginSessionContext } from "../../contexts/LoginSession"

const Profile: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()

	return (
		<>
			<div className="content">
				Hello, {loginSessionContext.user?.username}
			</div>
		</>
	)
}

export default Profile
