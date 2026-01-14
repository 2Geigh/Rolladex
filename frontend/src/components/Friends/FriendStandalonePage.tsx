import { useParams } from "react-router-dom"
import PageNotFound from "../PageNotFound/PageNotFound"
import { GetRelationshipTierInfo, type Friend } from "../../types/models/Friend"
import { useEffect, useState } from "react"
import { backend_base_url } from "../../util/url"
import Loading from "../Loading/Loading"
import "./styles/dist/FriendStandalonePage.min.css"
import type { Interaction } from "../../types/models/Interaction"

type FriendCardProps = {
	name: string
	profile_image_path: string | undefined
	relationship_tier: number
	last_interaction: Interaction
}
const FriendCard: React.FC<FriendCardProps> = ({
	name,
	profile_image_path,
	relationship_tier,
	last_interaction,
}) => {
	const relationship = GetRelationshipTierInfo(relationship_tier)
	const lastInteractionDate = last_interaction

	function deleteFriend() {
		return
	}

	return (
		<div id="friendCard">
			<div className="content">
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

				<div
					// className="friend_card_content_section"
					id="nameAndRelationship"
				>
					<h2 className="name">{name}</h2>
					<span className="relationship">
						<span className="relationship_tier">
							<span className="emoji">{relationship.emoji}</span>
							<span className="relationship_name">
								{relationship.name}
							</span>
						</span>
						<span className="relationship_health">
							Relationship status:{" "}
							<span className="health">healthy</span>
						</span>
					</span>
				</div>

				<div
					className="friend_card_content_section"
					id="lastInteraction"
				>
					<h3>Last interaction</h3>
					<span className="time_ago">
						<span className="number_of_time_units">{99}</span>
						<span className="time_unit">Months</span>
						<span className="ago">ago</span>
					</span>
					<button className="update">Update</button>
				</div>

				<div className="friend_card_content_section" id="birthday">
					<h3>Birthday</h3>
					<span className="emoji">🎂</span>
					<span className="birthday_date">
						<span className="month">September</span>
						<span className="day">29</span>
					</span>
				</div>

				<div className="friend_card_content_section" id="notes">
					<h3>Notes</h3>
					<textarea name="notes" id="notes"></textarea>
				</div>
			</div>

			<button id="deleteFriend" onClick={deleteFriend}>
				Delete friend
			</button>
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
			<div id="friendStandalonePageContent">
				<FriendCard
					name={friend.name}
					profile_image_path={friend.profile_image_path}
					relationship_tier={friend.relationship_tier}
					last_interaction={friend.last_interaction}
				/>
			</div>
		</>
	)
}

export default FriendStandalonePage
