import { useNavigate, useParams } from "react-router-dom"
import {
	GetRelationshipTierInfo,
	MAX_NAME_LENGTH,
	type Friend,
} from "../../types/models/Friend"
import React, { useEffect, useState } from "react"
import { backend_base_url } from "../../util/url"
import Loading from "../Loading/Loading"
import "./styles/FriendStandalonePage.scss"
import type { Interaction } from "../../types/models/Interaction"
import {
	GetMaxDaysInMonth,
	GetZodiac,
	MonthNumberToString,
	TimeAgo,
} from "../../util/dates"
import PageNotFoundWithoutHeaderAndFooter from "../PageNotFound/PageNotFoundWithoutHeaderAndFooter"

type UpdateLastInteractionProps = {
	friend_id: number
	friend_name: string
	setIsUpdatingLastInteraction: React.Dispatch<React.SetStateAction<boolean>>
}
const UpdateLastInteraction: React.FC<UpdateLastInteractionProps> = ({
	friend_id,
	friend_name,
	setIsUpdatingLastInteraction,
}) => {
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const input = document.getElementById(
			"newLastInteractionDate",
		) as HTMLInputElement
		const new_last_interaction_date = new Date(input.value).toISOString()

		const response = await fetch(
			`${backend_base_url}/friends/interactions`,
			{
				method: "PUT",
				credentials: "include",
				body: JSON.stringify({
					friend_id: friend_id,
					new_last_interaction_date: new_last_interaction_date,
				}),
			},
		)
		if (!response.ok) {
			throw new Error(`${response.statusText}: ${response.text}`)
		}

		setIsUpdatingLastInteraction(false)
	}

	return (
		<div id="updateLastInteraction">
			<form onSubmit={onSubmit}>
				<div
					className="cancel"
					onClick={() => {
						setIsUpdatingLastInteraction(false)
					}}
				>
					×
				</div>
				<label htmlFor="newLastInteractionDate">
					When'd you last interact with {friend_name}?
				</label>
				<input
					required
					id="newLastInteractionDate"
					name="new_last_interaction_date"
					max={new Date().toISOString().split("T")[0]}
					type="date"
					defaultValue={new Date().toISOString().split("T")[0]}
				/>
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
	notes: string | undefined
	setIsUpdatingLastInteraction: React.Dispatch<React.SetStateAction<boolean>>
	isEdittingFriend: boolean
	setIsEdittingFriend: React.Dispatch<React.SetStateAction<boolean>>
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
	notes,
	setIsUpdatingLastInteraction,
	isEdittingFriend,
	setIsEdittingFriend,
}) => {
	const relationship = GetRelationshipTierInfo(relationship_tier)
	const lastInteractionDate = last_interaction?.date

	const [draftBirthdayMonth, setDraftBirthdayMonth] = useState<null | string>(
		String(birthday_month),
	)
	const [notesState, setNotesState] = useState<string>("")
	const [isMounted, setIsMounted] = useState<boolean>(false)

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
		setIsEdittingFriend(true)
	}

	async function finishEdittingFriend() {
		const nameInput = document.getElementById(
			"nameInput",
		)! as HTMLInputElement
		const RelationshipSelect = document.getElementById(
			"relationshipSelect",
		) as HTMLSelectElement
		const birthdayMonthSelect = document.getElementById(
			"birthdayMonthSelect",
		) as HTMLSelectElement
		const birthdayDaySelect = document.getElementById(
			"birthdayDaySelect",
		) as HTMLSelectElement

		if (nameInput.value.length < 1) {
			alert("Name required")
			return
		}

		const reqBody = {
			id: id,
			name: nameInput.value,
			relationship_tier: parseInt(RelationshipSelect.value),
			birthday_month: parseInt(birthdayMonthSelect.value),
			birthday_day: parseInt(birthdayDaySelect.value),
		}

		const response = await fetch(`${backend_base_url}/friends/${id}`, {
			method: "PUT",
			credentials: "include",
			body: JSON.stringify(reqBody),
		})

		if (!response.ok) {
			throw new Error(`${response.statusText}: ${response.text}`)
		}

		setIsEdittingFriend(false)
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

	const maxDays = GetMaxDaysInMonth(draftBirthdayMonth)

	const DayOptions = Array.from(Array(maxDays).keys()).map((i: number) => {
		return <option value={i + 1}>{i + 1}</option>
	})

	async function updateNotes(noteString: string) {
		const response = await fetch(`${backend_base_url}/friends/notes`, {
			method: "PUT",
			credentials: "include",
			body: JSON.stringify({
				id: id,
				notes: noteString,
			}),
		})

		if (!response.ok) {
			throw new Error(`${response.statusText}: ${response.text}`)
		} else {
			console.log("Notes updated")
		}
	}

	useEffect(() => {
		if (!isMounted) {
			setIsMounted(true)
		} else {
			const runTimes = 1
			let count = 0
			const interval = setInterval(() => {
				updateNotes(notesState)

				count += 1
				if (count >= runTimes) {
					clearInterval(interval)
				}
			}, 250)
			return () => clearInterval(interval)
		}
	}, [notesState])

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
						:	"not_found"
					}
					alt={name}
					className="pfp"
				/>

				<div id="nameAndRelationship">
					{isEdittingFriend ?
						<input
							id="nameInput"
							className="name"
							type="text"
							defaultValue={name}
							minLength={1}
							maxLength={MAX_NAME_LENGTH}
						/>
					:	<h2 className="name">{name}</h2>}
					<span className="relationship">
						{isEdittingFriend ?
							<>
								<select
									id="relationshipSelect"
									className="relationship_tier"
									defaultValue={relationship_tier}
								>
									<option value={1}>
										<span className="relationship_name">
											{GetRelationshipTierInfo(1).name}
										</span>{" "}
										<span className="emoji">
											{GetRelationshipTierInfo(1).emoji}
										</span>
									</option>
									<option value={2}>
										<span className="relationship_name">
											{GetRelationshipTierInfo(2).name}
										</span>{" "}
										<span className="emoji">
											{GetRelationshipTierInfo(2).emoji}
										</span>
									</option>
									<option value={3}>
										<span className="relationship_name">
											{GetRelationshipTierInfo(3).name}
										</span>{" "}
										<span className="emoji">
											{GetRelationshipTierInfo(3).emoji}
										</span>
									</option>
									<option value={4}>
										<span className="relationship_name">
											{GetRelationshipTierInfo(4).name}
										</span>{" "}
										<span className="emoji">
											{GetRelationshipTierInfo(4).emoji}
										</span>
									</option>
								</select>
							</>
						:	<span className="relationship_tier">
								<span className="emoji">
									{relationship.emoji}
								</span>
								<span className="relationship_name">
									{relationship.name}
								</span>
							</span>
						}
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
					<button
						onClick={() => {
							setIsUpdatingLastInteraction(true)
						}}
						className="update"
					>
						Update
					</button>
				</div>

				<div className="friend_card_content_section" id="birthday">
					<h3>Birthday</h3>
					<span className="birthday_date">
						{isEdittingFriend ?
							<>
								<select
									className="month"
									id="birthdayMonthSelect"
									defaultValue={birthday_month}
									onChange={(e) =>
										setDraftBirthdayMonth(e.target.value)
									}
								>
									<option value="01">January</option>
									<option value="02">February</option>
									<option value="03">March</option>
									<option value="04">April</option>
									<option value="05">May</option>
									<option value="06">June</option>
									<option value="07">July</option>
									<option value="08">August</option>
									<option value="09">September</option>
									<option value="10">October</option>
									<option value="11">November</option>
									<option value="12">December</option>
								</select>

								<select
									className="day"
									id="birthdayDaySelect"
									defaultValue={birthday_day}
								>
									{DayOptions}
								</select>
							</>
						:	<>
								{(
									birthday_day &&
									birthday_day > 0 &&
									birthday_month &&
									birthday_month > 0
								) ?
									<>
										<span className="month">
											{MonthNumberToString(
												birthday_month,
											)}
										</span>
										<span className="day">
											{birthday_day}
										</span>
									</>
								:	"Unknown"}
							</>
						}
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
						onChange={() => {
							const notesTextArea = document.getElementById(
								"notes",
							)! as HTMLTextAreaElement
							setNotesState(notesTextArea.value)
						}}
						defaultValue={notes}
					></textarea>
				</div>
			</div>

			<div className="buttons">
				{isEdittingFriend ?
					<>
						<button
							id="saveButton"
							className="edit_friend"
							onClick={finishEdittingFriend}
						>
							Save
						</button>
						<button
							className="edit_friend"
							onClick={() => {
								setIsEdittingFriend(false)
							}}
						>
							Cancel
						</button>
					</>
				:	<button className="edit_friend" onClick={editFriend}>
						Edit friend
					</button>
				}

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
	const [isUpdatingLastInteraction, setIsUpdatingLastInteraction] =
		useState<boolean>(false)
	const [isEdittingFriend, setIsEdittingFriend] = useState<boolean>(false)

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
	}, [isUpdatingLastInteraction, isEdittingFriend, friendId])

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
					notes={friend.notes}
					setIsUpdatingLastInteraction={setIsUpdatingLastInteraction}
					isEdittingFriend={isEdittingFriend}
					setIsEdittingFriend={setIsEdittingFriend}
				/>
				{isUpdatingLastInteraction && (
					<UpdateLastInteraction
						friend_id={friendId}
						friend_name={friend.name}
						setIsUpdatingLastInteraction={
							setIsUpdatingLastInteraction
						}
					/>
				)}
			</div>
		</>
	)
}

export default FriendStandalonePage
