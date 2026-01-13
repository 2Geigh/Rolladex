import { useParams } from "react-router-dom"
import PageNotFound from "../PageNotFound/PageNotFound"
import type { Friend } from "../../types/models/Friend"
import { useEffect, useState } from "react"
import { backend_base_url } from "../../util/url"
import Loading from "../Loading/Loading"

type FriendCardProps = {
	id: number | string
	name: string
	profile_image_path: string | undefined
}

const FriendCard: React.FC<FriendCardProps> = ({
	id,
	name,
	profile_image_path,
}) => {
	return (
		<div className="friendCard" id={String(id)}>
			<h1 className="name">{name}</h1>

			<img
				src={
					(
						profile_image_path !== undefined &&
						profile_image_path.trim() !== ""
					) ?
						profile_image_path
					:	"not_found"
				}
				alt={name}
				className="pfp"
			/>

			<button className="deleteFriend">Delete friend</button>
		</div>
	)
}

const FriendStandalonePage: React.FC = () => {
	const params = useParams()
	const friendId = Number(params.friendId)

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [friend, setFriend] = useState<Friend | null>(null)

	async function getFriend(friendId: number): Promise<Friend> {
		const response = await fetch(
			`${backend_base_url}/friends/${friendId}`,
			{
				method: "GET",
				credentials: "include",
			},
		)

		if (!response.ok) {
			throw new Error(
				`${response.status}: couldn't get friend: ${response.body}`,
			)
		}

		const friend = (await response.json()) as Friend
		return friend
	}

	useEffect(() => {
		getFriend(friendId)
			.then((fetchedFriend) => {
				console.log(fetchedFriend)
				setFriend(fetchedFriend)
			})
			.catch((err) => {
				throw new Error(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return <Loading />
	}

	if (!friend) {
		return (
			<>
				<PageNotFound />
			</>
		)
	}

	return (
		<>
			<div className="content">
				<FriendCard
					id={friend.id}
					name={friend.name}
					profile_image_path={friend.profile_image_path}
				/>
			</div>
		</>
	)
}

export default FriendStandalonePage
