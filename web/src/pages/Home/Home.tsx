import React, { useEffect, useState } from "react"
import { useLoginSessionContext } from "../../contexts/LoginSession"
import "./styles/Home.scss"
import { GetRelationshipTierInfo, type Friend } from "../../types/models/Friend"
import { backend_base_url } from "../../util/url"
import type { JSX } from "react"

type Notification = {
	date: Date
	text: string
	friend_id: number
}

type HomepageContent = {
	todaysFriends: Friend[]
	notifications: Notification[]
}

type UrgentFriendsProps = {
	friends: Friend[]
	isLoading: boolean
}
const UrgentFriends: React.FC<UrgentFriendsProps> = ({
	friends,
	isLoading,
}) => {
	let MostUrgentFriends: JSX.Element[] = []
	MostUrgentFriends = friends.map((friend) => {
		return (
			<div
				className="urgent_friend"
				id={friends.indexOf(friend) == 0 ? "mostUrgent" : ""}
				key={friend.id}
			>
				<a href={`/friends/${friend.id}`}>
					<img
						src={friend.profile_image_path}
						alt={
							GetRelationshipTierInfo(friend.relationship_tier)
								.emoji
						}
					/>
				</a>

				<div className="body">
					<div className="top">
						<a className="name" href={`/friends/${friend.id}`}>
							{friend.name}
						</a>
						<div className="relationship_tier_emoji">
							{
								GetRelationshipTierInfo(
									friend.relationship_tier,
								).emoji
							}
						</div>
					</div>
					<div className="middle">
						Last interaction: {friend.days_since_last_interaction}{" "}
						days ago
					</div>
					<div className="bottom">
						<button>Update</button>
					</div>
				</div>
			</div>
		)
	})

	const NoFriends = (
		<div id="noFriends">
			<span className="emoji">🗿</span>
			<span>No pending communications.</span>
			<a href="/addfriend">Add a friend</a>
		</div>
	)

	if (isLoading) {
		return <>Loading...</>
	}

	return (
		<div id="urgentFriendsSection" className="homeSection">
			<h2>
				{new Date().toLocaleDateString("en-CA", {
					month: "long",
					day: "numeric",
					weekday: "long",
				})}
			</h2>

			{friends.length === 0 ?
				NoFriends
			:	<>
					<div id="urgentCards">{MostUrgentFriends}</div>
				</>
			}

			<a href="/friends">View all friends</a>
		</div>
	)
}

// type UpcomingProps = {
// 	daySelected: number
// 	setDaySelected: React.Dispatch<SetStateAction<number>>
// 	urgentFriendsByDay: Record<number, Friend[]>
// }
// const Upcoming: React.FC<UpcomingProps> = ({
// 	daySelected,
// 	setDaySelected,
// 	urgentFriendsByDay,
// }) => {
// 	if (!urgentFriendsByDay) {
// 		return <>Nothing...</>
// 	}

// 	const CalendarColumns = Object.values(urgentFriendsByDay).map(
// 		(friends, i) => {
// 			const date = new Date()
// 			date.setDate(date.getDate() + i)

// 			let todayIsBirthday = false
// 			let closestRelationshipTier = 99
// 			for (const friend of friends) {
// 				const today = new Date()
// 				const isBirthdayToday =
// 					friend.birthday_day === today.getDate() &&
// 					friend.birthday_month === today.getMonth() + 1
// 				if (isBirthdayToday) {
// 					todayIsBirthday = true
// 				}
// 				if (friend.relationship_tier < closestRelationshipTier) {
// 					closestRelationshipTier = friend.relationship_tier
// 				}
// 			}

// 			function onClickColumn(e: React.MouseEvent<HTMLDivElement>) {
// 				e.preventDefault()

// 				const allColumns = document.getElementsByClassName("column")
// 				for (const column of allColumns) {
// 					column.classList.remove("selected")
// 				}

// 				const selectedColumn = e.currentTarget
// 				selectedColumn.classList.add("selected")

// 				const selectedDay = parseInt(selectedColumn.id)
// 				setDaySelected(selectedDay)
// 			}

// 			const CalendarColumnImages = friends.map((friend) => (
// 				<img
// 					className="icon"
// 					src={friend.profile_image_path}
// 					alt={friend.name}
// 					key={friend.id}
// 				/>
// 			))

// 			return (
// 				<>
// 					<div
// 						className={
// 							i === daySelected ? "column selected" : "column"
// 						}
// 						id={String(i)}
// 						onClickCapture={onClickColumn}
// 					>
// 						<div className="day_header">{date.getDate()}</div>
// 						<div className="body">
// 							<div className="icons">{CalendarColumnImages}</div>

// 							<div className="emoji">
// 								{friends.length < 1 ?
// 									"🫥"
// 								: todayIsBirthday ?
// 									"🎂"
// 								:	GetRelationshipTierInfo(
// 										closestRelationshipTier,
// 									).emoji
// 								}
// 							</div>
// 						</div>
// 					</div>
// 				</>
// 			)
// 		},
// 	)

// 	return (
// 		<div id="upcomingSection" className="homeSection">
// 			<h2>Upcoming....</h2>

// 			<div id="calendar">{CalendarColumns}</div>
// 		</div>
// 	)
// }

const Home: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [homepageContent, setHomepageContent] = useState<HomepageContent>({
		todaysFriends: [],
		notifications: [],
	})

	async function getUpcomingUrgentFriends(): Promise<HomepageContent> {
		const response = await fetch(`${backend_base_url}/home`, {
			method: "GET",
			credentials: "include",
		})

		if (!response.ok) {
			throw new Error(`${response.statusText}: ${response.text}`)
		}

		const data = await response.json()
		const homepage_content = data as HomepageContent

		return homepage_content
	}

	useEffect(() => {
		getUpcomingUrgentFriends()
			.catch((err) => {
				throw new Error(err)
			})
			.then((homepage_content) => {
				console.log(homepage_content)
				setHomepageContent(homepage_content)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	return (
		<div id="homeContent">
			{loginSessionContext.user ?
				<h1>Hello, {loginSessionContext.user?.username}.</h1>
			:	<h1>Good afternoon.</h1>}

			<div id="homeSections">
				<UrgentFriends
					isLoading={isLoading}
					friends={homepageContent.todaysFriends}
				/>
				{/* <Upcoming
					daySelected={daySelected}
					setDaySelected={setDaySelected}
					urgentFriendsByDay={urgentFriendsByDay}
				/> */}
			</div>
		</div>
	)
}

export default Home
