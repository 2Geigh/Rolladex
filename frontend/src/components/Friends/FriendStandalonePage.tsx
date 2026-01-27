import { useNavigate, useParams } from "react-router-dom"
import { GetRelationshipTierInfo, type Friend } from "../../types/models/Friend"
import React, { useEffect, useState } from "react"
import { backend_base_url } from "../../util/url"
import Loading from "../Loading/Loading"
import "./styles/FriendStandalonePage.css"
import type { Interaction } from "../../types/models/Interaction"
import { GetZodiac, MonthNumberToString, TimeAgo } from "../../util/dates"
import PageNotFoundWithoutHeaderAndFooter from "../PageNotFound/PageNotFoundWithoutHeaderAndFooter"

type UpdateLastInteractionProps = {
	friend_id: number
	friend_name: string
	setIsUpdatingLastInteraction: React.Dispatch<React.SetStateAction<boolean>>
}
const UpdateLastInteraction: React.FC<UpdateLastInteractionProps> = ({ friend_id, friend_name, setIsUpdatingLastInteraction }) => {
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setIsUpdatingLastInteraction(false)

		const input = document.getElementById("newLastInteractionDate") as HTMLInputElement
		const new_last_interaction_date = new Date(input.value).toUTCString()

		const response = await fetch(`${backend_base_url}/friends/${friend_id}/interactions`,
			{
				method: "PUT",
				credentials: "include",
				body: JSON.stringify({ new_last_interaction_date: new_last_interaction_date })
			})
		if (!response.ok) {
			throw new Error(`${response.statusText}: ${response.text}`)
		}
	}

	return (
		<div id="updateLastInteraction">
			<form onSubmit={onSubmit}>
				<div className="cancel" onClick={() => { setIsUpdatingLastInteraction(false) }}>×</div>
				<label htmlFor="newLastInteractionDate">
					When'd you last interact with {friend_name}?
				</label>
				<input
					required
					id="newLastInteractionDate"
					name="new_last_interaction_date"
					max={new Date().toISOString().split("T")[0]}
					type="date"
					defaultValue={new Date().toISOString().split("T")[0]} />
				<input className="submit" type="submit" value="Update" />
			</form>
		</div>
	)
}

type FriendCardProps = {
	id: number
	name: string
	profile_image_path: string | undefined
	relationship_tier: number
	relationship_health: number
	last_interaction: Interaction | undefined
	birthday_month: number | undefined
	birthday_day: number | undefined
	setIsUpdatingLastInteraction: React.Dispatch<React.SetStateAction<boolean>>
}
const FriendCard: React.FC<FriendCardProps> = ({
	id,
	name,
	profile_image_path,
	relationship_tier,
	relationship_health,
	last_interaction,
	birthday_day,
	birthday_month,
	setIsUpdatingLastInteraction
}) => {
	const relationship = GetRelationshipTierInfo(relationship_tier)
	const lastInteractionDate = last_interaction?.date

	const navigate = useNavigate()

	async function deleteFriend() {
		const response = await fetch(`${backend_base_url}/friends/${id}`, {
			method: "DELETE",
			credentials: "include",
		})

		if (!response.ok) {
			throw new Error(`${response.status}: ${response.statusText}`)
		}

		return
	}

	function editFriend() {
		return
	}

	const zodiac = GetZodiac(birthday_month, birthday_day)

	function percentageToHexColor(percentage: number): string {
		percentage = Math.min(100, percentage)
		percentage = Math.max(0, percentage)

		const red = Math.round(((100 - percentage) * 255) / 100)
		const green = Math.round((percentage * 255) / 100)

		const redHex = red.toString(16).padStart(2, "0")
		const greenHex = green.toString(16).padStart(2, "0")

		return `#${redHex}${greenHex}00`
	}

	const relationship_health_percentage = Math.round(relationship_health * 100)

	return (
		<div id="friendCard">
			<div className="nameAndPhoto">
				<img
					src={
						(
							profile_image_path !== undefined &&
							profile_image_path.trim() !== ""
						) ?
							profile_image_path
							: "not_found"
					}
					alt={name}
					className="pfp"
				/>

				<div id="nameAndRelationship">
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
							<span
								id="healthValue"
								className="health"
								style={{
									color: percentageToHexColor(
										relationship_health_percentage,
									),
								}}
							>
								{relationship_health_percentage}%
							</span>
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
						{TimeAgo(lastInteractionDate)} ago
					</span>
					<button onClick={() => { setIsUpdatingLastInteraction(true) }} className="update">Update</button>
				</div>

				<div className="friend_card_content_section" id="birthday">
					<h3>Birthday</h3>
					<span className="birthday_date">
						{(
							birthday_day &&
							birthday_day > 0 &&
							birthday_month &&
							birthday_month > 0
						) ?
							<>
								<span className="month">
									{MonthNumberToString(birthday_month)}
								</span>
								<span className="day">{birthday_day}</span>
							</>
							: "Unknown"}
					</span>
					<span className="emoji" title={zodiac.zodiacName}>
						{zodiac.zodiacEmoji}
					</span>
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

				<button
					id="deleteFriend"
					onClick={() => {
						deleteFriend()
							.catch((err) => {
								throw new Error(err)
							})
							.finally(() => navigate("/friends"))
					}}
				>
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
	const [isUpdatingLastInteraction, setIsUpdatingLastInteraction] = useState<boolean>(false)

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
				setFriend(fetchedFriend)
			})
			.catch((err) => {
				throw new Error(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [isUpdatingLastInteraction])

	if (isLoading) {
		return <Loading />
	}

	if (!friend) {
		return (
			<>
				<PageNotFoundWithoutHeaderAndFooter />
			</>
		)
	}

	return (
		<>
			<div id="friendStandalonePageContent">
				<FriendCard
					id={friend.id}
					name={friend.name}
					profile_image_path={friend.profile_image_path}
					relationship_tier={friend.relationship_tier}
					relationship_health={friend.relationship_health}
					last_interaction={friend.last_interaction}
					birthday_month={friend.birthday_month}
					birthday_day={friend.birthday_day}
					setIsUpdatingLastInteraction={setIsUpdatingLastInteraction}
				/>
				{isUpdatingLastInteraction &&
					<UpdateLastInteraction
						friend_id={friendId}
						friend_name={friend.name}
						setIsUpdatingLastInteraction={setIsUpdatingLastInteraction}
					/>
				}
			</div>
		</>
	)
}

export default FriendStandalonePage
