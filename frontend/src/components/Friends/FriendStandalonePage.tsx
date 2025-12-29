import { useParams, Navigate } from "react-router"
import Navbar from "../Navbar/Navbar"
import friends from "../../util/friends_sample_data"
import "./styles/dist/FriendStandalonePage.min.css"
import PageNotFound from "../PageNotFound/PageNotFound"
import Footer from "../Footer/Footer"
import { UseAuthContext } from "../../contexts/auth"
import { useLayoutEffect } from "react"
import { RedirectIfSessionInvalid } from "../../contexts/auth"

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

const FriendStandalonePage: React.FC = () => {
	const params = useParams()

	// Validate login session before component renders
	const authContext = UseAuthContext()
	useLayoutEffect(() => {
		RedirectIfSessionInvalid(
			authContext.isSessionValid,
			authContext.setIsSessionValid,
		)
	}, [authContext.isSessionValid, authContext.setIsSessionValid])
	if (!authContext.isSessionValid) {
		return <Navigate to="/login" />
	}

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
	const profile_image_path = String(friend.profileImageId)

	return (
		<>
			<Navbar />

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
