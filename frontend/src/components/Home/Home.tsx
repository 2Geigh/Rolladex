import React, { useEffect, useState } from "react"
import { useLoginSessionContext } from "../../contexts/LoginSession"
import "./styles/Home.css"
import type { Friend } from "../../types/models/Friend"
import { backend_base_url } from "../../util/url"
import type { JSX } from "react"
import { TimeAgo } from "../../util/dates"

const UrgentFriends: React.FC = () => {
	type UrgentFriendAndStatus = {
		friend: Friend,
		status: string
	}

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [mostUrgentFriendsToRender, setMostUrgentFriendsToRender] = useState<Friend[]>([])

	async function getMostUrgentFriends(): Promise<Array<UrgentFriendAndStatus>> {
		let urgentFriends: Friend[] = []

		const response = await fetch(`${backend_base_url}/friends/urgent`, {
			method: "GET",
			credentials: "include",
		})
		if (!response.ok) {
			throw new Error(`${response.statusText}: ${response.text}`)
		}

		const data = await response.json()
		const urgentFriendsAndStatuses = data as UrgentFriendAndStatus[]

		return urgentFriendsAndStatuses
	}

	useEffect(() => {
		getMostUrgentFriends()
			.then((urgentFriends) => {
				let toRender: Friend[] = []
				for (let friendAndStatus of urgentFriends) {
						if (friendAndStatus.status.trim() === "" || friendAndStatus.status === null || friendAndStatus.status === undefined) {
							toRender.push(friendAndStatus.friend)
						}
					}
				return toRender})
			.then((toRender) => {setMostUrgentFriendsToRender(toRender)})
			.catch((err) => {throw new Error(err)})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	

	const MostUrgentFriends: JSX.Element[] = mostUrgentFriendsToRender.map((friend) => {

		const today = new Date()
		const isBirthdayToday =
			today.getMonth() + 1 === friend.birthday_month && // Because today.getMonth() returns January as 0 🤦
			today.getDate() === friend.birthday_day		

		async function ignoreFriend(event: React.MouseEvent<HTMLButtonElement>) {
			event.preventDefault()

			const response = await fetch(`${backend_base_url}/friends/status`, {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({ friend_id: friend.id, action: "ignore" })
			})

			if (!response.ok) {
				throw new Error(`${response.statusText}: ${response.text}`)
			}

			
			let newMostUrgentFriends: Friend[] = []
			for (let urgentFriend of mostUrgentFriendsToRender) {
				if (urgentFriend.id !== friend.id) {
					
				}
			}

			setMostUrgentFriendsToRender(mostUrgentFriendsToRender.filter((urgentFriend) => {
				urgentFriend.id !== friend.id
			}))
		}

		async function completeFriend(event: React.MouseEvent<HTMLButtonElement>) {
			event.preventDefault()

			event.target

			const response = await fetch(`${backend_base_url}/friends/status`, {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({ friend_id: friend.id, action: "complete" })
			})

			if (!response.ok) {
				throw new Error(`${response.statusText}: ${response.text}`)
			}

			setMostUrgentFriendsToRender(mostUrgentFriendsToRender.filter((urgentFriend) => {
				urgentFriend.id != friend.id
			}))
		}

		if (isLoading) {
			return <>Loading...</>
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
						<a href={`/friends/${friend.id}`} className="name">
							{friend.name}
						</a>
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
												friend.last_interaction.date,
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
						<button className="ignore" onClick={ignoreFriend}>Ignore</button>
						<button className="mark_completed" onClick={completeFriend}>
							Mark completed
						</button>
					</div>
				</div>
			</div>
		)
	})

	if (isLoading) {
		return <>Loading...</>
	}

	return (
		<div id="urgentFriendsSection" className=".homeSection">
			<h2>Today you should contact..</h2>

			<div id="urgentCards">{MostUrgentFriends}</div>
		</div>
	)
}

const Upcoming: React.FC = () => {
	return <div id="upcomingSection" className=".homeSection"></div>
}

const Home: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()

	return (
		<div id="homeContent">
			{loginSessionContext.user ?
				<h1>Hello, {loginSessionContext.user?.username}</h1>
			:	<h1>Good afternoon.</h1>}

			<div id="homeSections">
				<UrgentFriends />
				{/* <Upcoming /> */}
			</div>
		</div>
	)
}

export default Home
