import { useParams } from "react-router-dom"
import PageNotFound from "../PageNotFound/PageNotFound"
import { GetRelationshipTierInfo, type Friend } from "../../types/models/Friend"
import { useEffect, useState } from "react"
import { backend_base_url } from "../../util/url"
import Loading from "../Loading/Loading"
import "./styles/dist/FriendStandalonePage.min.css"
import type { Interaction } from "../../types/models/Interaction"
import { GetZodiac, MonthNumberToString, TimeAgo } from "../../util/dates"

type FriendCardProps = {
	name: string
	profile_image_path: string | undefined
	relationship_tier: number
	last_interaction: Interaction | undefined
	birthday_month: number | undefined
	birthday_day: number | undefined
}
const FriendCard: React.FC<FriendCardProps> = ({
	name,
	profile_image_path,
	relationship_tier,
	last_interaction,
	birthday_day,
	birthday_month,
}) => {
	const relationship = GetRelationshipTierInfo(relationship_tier)
	const lastInteractionDate = last_interaction?.date

	function deleteFriend() {
		return
	}

	function editFriend() {
		return
	}

	const zodiac = GetZodiac(birthday_month, birthday_day)

	return (
		<div id="friendCard">
			<div className="nameAndPhoto">
				<img
					// src={
					// 	(
					// 		profile_image_path !== undefined &&
					// 		profile_image_path.trim() !== ""
					// 	) ?
					// 		profile_image_path
					// 	:	"not_found"
					// }

					src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg-s-msn-com.akamaized.net%2Ftenant%2Famp%2Fentityid%2FAA1U4RrL.img%3Fw%3D1540%26h%3D800%26m%3D4%26q%3D70&f=1&nofb=1&ipt=f8864105c21c63c8016536524df770cec92606e9bc85e0321dbe7a312ff1f911"
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
			</div>

			<div className="card_content">
				<div
					className="friend_card_content_section"
					id="lastInteraction"
				>
					<h3>Last interaction</h3>
					<span className="time_ago">
						{TimeAgo(lastInteractionDate)}
					</span>
					<button className="update">Update</button>
				</div>

				<div className="friend_card_content_section" id="birthday">
					<h3>Birthday</h3>
					<span className="birthday_date">
						<span className="month">
							{MonthNumberToString(birthday_month)}
						</span>
						<span className="day">{birthday_day}</span>
					</span>
					<span className="emoji">{zodiac.zodiacEmoji}</span>
				</div>

				<div className="friend_card_content_section" id="notesSection">
					<h3>Notes</h3>
					<textarea
						name="notes"
						id="notes"
						maxLength={999}
					></textarea>
				</div>
			</div>

			<div className="buttons">
				<button id="editFriend" onClick={editFriend}>
					Edit friend
				</button>

				<button id="deleteFriend" onClick={deleteFriend}>
					Delete friend
				</button>
			</div>
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
					birthday_month={friend.birthday_month}
					birthday_day={friend.birthday_day}
				/>
			</div>
		</>
	)
}

export default FriendStandalonePage
