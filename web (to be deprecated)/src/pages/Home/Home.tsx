import React, { useEffect, useState } from "react"
import { useLoginSessionContext } from "../../contexts/LoginSession"
import "./styles/Home.scss"
import { GetRelationshipTierInfo, type Friend } from "../../types/models/Friend"
import { backend_base_url } from "../../util/url"
import type { JSX, SetStateAction } from "react"
import { TimeAgo, addDays } from "../../util/dates"

type UrgentFriendsProps = {
	urgentFriendsByDay: Record<number, Friend[]>
	daySelected: number
	isLoading: boolean
	numberOfRerenders: number
	setNumberOfRerenders: React.Dispatch<SetStateAction<number>>
}
const UrgentFriends: React.FC<UrgentFriendsProps> = ({
	urgentFriendsByDay,
	daySelected,
	isLoading,
	numberOfRerenders,
	setNumberOfRerenders,
}) => {
	let weekEmpty = true
	for (let key in Object.values(urgentFriendsByDay)) {
		if (urgentFriendsByDay[key].length > 0) {
			weekEmpty = false
			break
		}
	}
	let MostUrgentFriends: JSX.Element[] = []
	if (!weekEmpty) {
		MostUrgentFriends = urgentFriendsByDay[daySelected].map((friend) => {
			const today = new Date()
			const isBirthdayToday =
				today.getMonth() + 1 === friend.birthday_month && // Because today.getMonth() returns January as 0 🤦
				today.getDate() === friend.birthday_day

			async function ignoreFriend(
				event: React.MouseEvent<HTMLButtonElement>,
			) {
				event.preventDefault()

				const response = await fetch(
					`${backend_base_url}/friends/status`,
					{
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							friend_id: friend.id,
							action: "ignore",
						}),
					},
				)

				if (!response.ok) {
					throw new Error(`${response.statusText}: ${response.text}`)
				}

				setNumberOfRerenders(numberOfRerenders + 1)
			}

			async function completeFriend(
				event: React.MouseEvent<HTMLButtonElement>,
			) {
				event.preventDefault()

				const response = await fetch(
					`${backend_base_url}/friends/status`,
					{
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							friend_id: friend.id,
							action: "complete",
						}),
					},
				)

				if (!response.ok) {
					throw new Error(`${response.statusText}: ${response.text}`)
				}

				setNumberOfRerenders(numberOfRerenders + 1)
			}

			return (
				<div className="urgent_friend" key={friend.id}>
					<a href={`/friends/${friend.id}`}>
						<img
							src={String(friend.profile_image_path)}
							alt={friend.name}
						/>
					</a>

					<div className="body">
						<div className="text">
							<span className="name_and_relationship_tier">
								<a
									href={`/friends/${friend.id}`}
									className="name"
								>
									{friend.name}
								</a>
								<div className="relationship_icon">
									{
										GetRelationshipTierInfo(
											friend.relationship_tier,
										).emoji
									}
								</div>
							</span>
							{isBirthdayToday ?
								<div className="under_name birthday">
									Today's {friend.name}'s birthday!
									<br></br>
									<div className="emoji">🎂 🎁 🎉</div>
								</div>
							:	<div className="under_name last_interaction">
									Last interaction:{" "}
									<span className="time_ago">
										{friend.last_interaction ?
											(
												TimeAgo(
													friend.last_interaction
														.date,
												) === "Just now"
											) ?
												<>Just now</>
											:	<>
													{TimeAgo(
														friend.last_interaction
															.date,
													)}{" "}
													ago
												</>

										:	<>Unknown</>}
									</span>
								</div>
							}
						</div>

						<div className="buttons">
							<button className="ignore" onClick={ignoreFriend}>
								Ignore
							</button>
							<button
								className="mark_completed"
								onClick={completeFriend}
							>
								Mark completed
							</button>
						</div>
					</div>
				</div>
			)
		})
	}
	let NoFriends = (
		<div id="noFriends">
			<span>No upcoming communications. 🗿</span>
			<a href="/addfriend">Add a friend</a>
		</div>
	)

	if (isLoading) {
		return <>Loading...</>
	}

	return (
		<div id="urgentFriendsSection" className="homeSection">
			<h2>
				{addDays(new Date(), daySelected).toLocaleDateString("en-CA", {
					month: "long",
					day: "numeric",
					weekday: "long",
				})}
			</h2>

			{weekEmpty ?
				NoFriends
			:	<>
					<div id="urgentCards">{MostUrgentFriends}</div>
				</>
			}
		</div>
	)
}

type UpcomingProps = {
	daySelected: number
	setDaySelected: React.Dispatch<SetStateAction<number>>
	urgentFriendsByDay: Record<number, Friend[]>
}
const Upcoming: React.FC<UpcomingProps> = ({
	daySelected,
	setDaySelected,
	urgentFriendsByDay,
}) => {
	if (!urgentFriendsByDay) {
		return <>Nothing...</>
	}

	const CalendarColumns = Object.values(urgentFriendsByDay).map(
		(friends, i) => {
			const date = new Date()
			date.setDate(date.getDate() + i)

			let todayIsBirthday = false
			let closestRelationshipTier = 99
			for (const friend of friends) {
				const today = new Date()
				const isBirthdayToday =
					friend.birthday_day === today.getDate() &&
					friend.birthday_month === today.getMonth() + 1
				if (isBirthdayToday) {
					todayIsBirthday = true
				}
				if (friend.relationship_tier < closestRelationshipTier) {
					closestRelationshipTier = friend.relationship_tier
				}
			}

			function onClickColumn(e: React.MouseEvent<HTMLDivElement>) {
				e.preventDefault()

				const allColumns = document.getElementsByClassName("column")
				for (const column of allColumns) {
					column.classList.remove("selected")
				}

				const selectedColumn = e.currentTarget
				selectedColumn.classList.add("selected")

				const selectedDay = parseInt(selectedColumn.id)
				setDaySelected(selectedDay)
			}

			const CalendarColumnImages = friends.map((friend) => (
				<img
					className="icon"
					src={friend.profile_image_path}
					alt={friend.name}
					key={friend.id}
				/>
			))

			return (
				<>
					<div
						className={
							i === daySelected ? "column selected" : "column"
						}
						id={String(i)}
						onClickCapture={onClickColumn}
					>
						<div className="day_header">{date.getDate()}</div>
						<div className="body">
							<div className="icons">{CalendarColumnImages}</div>

							<div className="emoji">
								{friends.length < 1 ?
									"🫥"
								: todayIsBirthday ?
									"🎂"
								:	GetRelationshipTierInfo(
										closestRelationshipTier,
									).emoji
								}
							</div>
						</div>
					</div>
				</>
			)
		},
	)

	return (
		<div id="upcomingSection" className="homeSection">
			<h2>Upcoming....</h2>

			<div id="calendar">{CalendarColumns}</div>
		</div>
	)
}

const Home: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [urgentFriendsByDay, setUrgentFriendsByDay] = useState<
		Record<number, Friend[]>
	>({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] })
	const [daySelected, setDaySelected] = useState<number>(0)
	const [numberOfRerenders, setNumberOfRerenders] = useState<number>(0)

	async function getUpcomingUrgentFriends(): Promise<
		Record<number, Friend[]>
	> {
		let urgentFriendsForComingDays: Record<number, Friend[]> = {}

		const response = await fetch(`${backend_base_url}/home`, {
			method: "GET",
			credentials: "include",
		})

		if (!response.ok) {
			throw new Error(`${response.statusText}: ${response.text}`)
		}

		const data = await response.json()
		urgentFriendsForComingDays = data as Record<number, Friend[]>

		return urgentFriendsForComingDays
	}

	useEffect(() => {
		getUpcomingUrgentFriends()
			.catch((err) => {
				throw new Error(err)
			})
			.then((urgentFriendsForComingDays) => {
				setUrgentFriendsByDay(urgentFriendsForComingDays)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [numberOfRerenders])

	return (
		<div id="homeContent">
			{loginSessionContext.user ?
				<h1>Hello, {loginSessionContext.user?.username}.</h1>
			:	<h1>Good afternoon.</h1>}

			<div id="homeSections">
				<UrgentFriends
					isLoading={isLoading}
					daySelected={daySelected}
					urgentFriendsByDay={urgentFriendsByDay}
					numberOfRerenders={numberOfRerenders}
					setNumberOfRerenders={setNumberOfRerenders}
				/>
				<Upcoming
					daySelected={daySelected}
					setDaySelected={setDaySelected}
					urgentFriendsByDay={urgentFriendsByDay}
				/>
			</div>
		</div>
	)
}

export default Home
