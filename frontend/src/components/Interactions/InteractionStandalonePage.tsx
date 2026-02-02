import { useParams } from "react-router-dom"
import { GetRelationshipTierInfo, type Friend } from "../../types/models/Friend"
import React, { useEffect, useState, type SetStateAction } from "react"
import { backend_base_url } from "../../util/url"
import Loading from "../Loading/Loading"
import type { Interaction } from "../../types/models/Interaction"
import PageNotFoundWithoutHeaderAndFooter from "../PageNotFound/PageNotFoundWithoutHeaderAndFooter"
import "./styles/InteractionStandalonePage.css"
import { TimeAgo } from "../../util/dates"

type FriendCardProps = {
	id: number
	date: Date
	attendees: Array<Friend>
	interaction_type: string | undefined
	name: string | undefined
	location: string | undefined
	isEdittingInteraction: boolean
	setIsEdittingInteraction: React.Dispatch<SetStateAction<boolean>>
}
const InteractionCard: React.FC<FriendCardProps> = ({
	id,
	date,
	attendees,
	name,
	location,
	// isEdittingInteraction,
	// setIsEdittingInteraction,
}) => {
	// async function deleteInteraction() {
	// 	const response = await fetch(`${backend_base_url}/friends/${id}`, {
	// 		method: "DELETE",
	// 		credentials: "include",
	// 	})

	// 	if (!response.ok) {
	// 		throw new Error(`${response.status}: ${response.statusText}`)
	// 	}

	// 	return
	// }

	// function editInteraction() {
	// 	setIsEdittingInteraction(true)
	// }

	// async function finishEdittingInteraction() {
	// 	const nameInput = document.getElementById(
	// 		"nameInput",
	// 	)! as HTMLInputElement
	// 	const RelationshipSelect = document.getElementById(
	// 		"relationshipSelect",
	// 	) as HTMLSelectElement
	// 	const birthdayMonthSelect = document.getElementById(
	// 		"birthdayMonthSelect",
	// 	) as HTMLSelectElement
	// 	const birthdayDaySelect = document.getElementById(
	// 		"birthdayDaySelect",
	// 	) as HTMLSelectElement

	// 	if (nameInput.value.length < 1) {
	// 		alert("Name required")
	// 		return
	// 	}

	// 	const reqBody = {
	// 		id: id,
	// 		name: nameInput.value,
	// 		relationship_tier: parseInt(RelationshipSelect.value),
	// 		birthday_month: parseInt(birthdayMonthSelect.value),
	// 		birthday_day: parseInt(birthdayDaySelect.value),
	// 	}

	// 	const response = await fetch(`${backend_base_url}/friends/${id}`, {
	// 		method: "PUT",
	// 		credentials: "include",
	// 		body: JSON.stringify(reqBody),
	// 	})

	// 	if (!response.ok) {
	// 		throw new Error(`${response.statusText}: ${response.text}`)
	// 	}

	// 	setIsEdittingInteraction(false)
	// }

	const AttendeeList = attendees.map((attendee) => (
		<>
			<span className="attendee" key={attendee.name}>
				<div className="emoji">
					{GetRelationshipTierInfo(attendee.relationship_tier).emoji}
				</div>
				<a href={`/friends/${attendee.id}`} className="name">
					{attendee.name}
				</a>
			</span>
		</>
	))

	return (
		<div id="interactionCard" key={id}>
			<div className="name_and_subtitle">
				<div className="name">
					<h1>{name ? name : "Unnamed Interaction"}</h1>
					<span className="time_ago">
						(
						{TimeAgo(date) === "Just now" ?
							"Just now"
						:	`${TimeAgo(date)} ago`}
						)
					</span>
				</div>
				<div className="date">
					<span className="emoji">📅</span>Wednesday, Septembruary 19,
					2025
				</div>
				<div className="location">
					<span className="emoji">📍</span>
					{location ? location : "Unspecified"}
				</div>
			</div>
			<div className="attendees">
				<h2>Attendees</h2>
				<div className="attendee_list">{AttendeeList}</div>
			</div>
			<div className="buttons">
				<button className="edit">Edit</button>
				<button className="delete">Delete</button>
			</div>
		</div>
	)
}

const InteractionStandalonePage: React.FC = () => {
	const params = useParams()
	const interactionId = Number(params.interactionId)

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [interaction, setInteraction] = useState<Interaction | null>(null)
	const [isEdittingInteraction, setIsEdittingInteraction] =
		useState<boolean>(false)

	async function getInteraction(interactionId: number): Promise<Interaction> {
		const response = await fetch(
			`${backend_base_url}/interactions/${interactionId}`,
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

		const interaction = (await response.json()) as Interaction
		return interaction
	}

	useEffect(() => {
		getInteraction(interactionId)
			.then((fetchedInteraction) => {
				console.log(fetchedInteraction)
				setInteraction(fetchedInteraction)
			})
			.catch((err) => {
				throw new Error(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [isEdittingInteraction, setIsEdittingInteraction, interactionId])

	if (isLoading) {
		return <Loading />
	}

	if (!interaction) {
		return (
			<>
				<PageNotFoundWithoutHeaderAndFooter />
			</>
		)
	}

	return (
		<>
			<div id="interactionStandalonePageContent">
				<InteractionCard
					id={interaction.id}
					date={interaction.date}
					attendees={interaction.attendees}
					interaction_type={interaction.interaction_type}
					isEdittingInteraction={isEdittingInteraction}
					name={interaction.name}
					location={interaction.location}
					setIsEdittingInteraction={setIsEdittingInteraction}
				/>
			</div>
		</>
	)
}

export default InteractionStandalonePage
