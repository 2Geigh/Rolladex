import { useParams, Navigate } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
import friends from "../../util/friends_sample_data"
import "./styles/dist/FriendStandalonePage.min.css"
import PageNotFound from "../PageNotFound/PageNotFound"
import Footer from "../Footer/Footer"
import { useState } from "react"
import Loading from "../Loading/Loading"
import { useLayoutEffect } from "react"
import { IsLoginSessionValid } from "../../contexts/auth"

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

	// Auth guard
	const [isLoginSessionValid, setIsLoginSessionValid] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	useLayoutEffect(() => {
		IsLoginSessionValid()
			.then((isValid) => {
				setIsLoginSessionValid(isValid)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])
	if (isLoading) {
		return <Loading />
	}
	if (!isLoginSessionValid) {
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
