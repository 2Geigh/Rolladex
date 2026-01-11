import { useParams } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
import PageNotFound from "../PageNotFound/PageNotFound"
import Footer from "../Footer/Footer"
import type { Friend } from "../../types/models/Friend"
import { useLoginSessionContext } from "../../contexts/LoginSession"

type FriendCardProps = {
	id: number | string
	name: string
	profile_image_path: string
}

const FriendCard: React.FC<FriendCardProps> = ({
	id,
	name,
	profile_image_path,
}) => {
	return (
		<div className="friendCard" id={String(id)}>
			<h1 className="name">{name}</h1>

			<img src={profile_image_path} alt={name} className="pfp" />

			<button className="deleteFriend">Delete friend</button>
		</div>
	)
}

const friends: Array<Friend> = []

const FriendStandalonePage: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()
	const params = useParams()

	const friendId: number = Number(params.friendId)
	const friend = friends.find((friend) => friend.id === friendId)

	if (!friend) {
		return (
			<>
				<PageNotFound />
			</>
		)
	}

	const name = String(friend.name)
	const profile_image_path = String(friend.profile_image_path)

	return (
		<>
			<Navbar username={loginSessionContext.user?.username} />

			<div className="content">
				<FriendCard
					id={friendId}
					name={name}
					profile_image_path={profile_image_path}
				/>
			</div>

			<Footer />
		</>
	)
}

export default FriendStandalonePage
