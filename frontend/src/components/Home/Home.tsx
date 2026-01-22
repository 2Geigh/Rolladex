import { useEffect, useState } from "react"
import { useLoginSessionContext } from "../../contexts/LoginSession"
import "./styles/Home.css"
import type { Friend } from "../../types/models/Friend"
import { backend_base_url } from "../../util/url"
import type { JSX } from "react"
import { TimeAgo } from "../../util/dates"

const UrgentFriends: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [mostUrgentFriends, setMostUrgentFriends] = useState<Friend[]>([])

	async function getMostUrgentFriends(): Promise<Friend[]> {
		let urgentFriends: Friend[] = []

		const response = await fetch(`${backend_base_url}/friends/urgent`, {
			method: "GET",
			credentials: "include",
		})
		if (!response.ok) {
			throw new Error(`${response.statusText}: ${response.text}`)
		}

		const data = await response.json()
		urgentFriends = data as Friend[]

		return urgentFriends
	}

	useEffect(() => {
		getMostUrgentFriends()
			.then((urgentFriends) => {
				setMostUrgentFriends(urgentFriends)
				console.log(urgentFriends)
			})
			.catch((err) => {
				throw new Error(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	const MostUrgentFriends: JSX.Element[] = mostUrgentFriends.map((friend) => {
		const today = new Date()
		const isBirthdayToday =
			today.getMonth() + 1 === friend.birthday_month && // Because today.getMonth() returns January as 0 🤦
			today.getDate() === friend.birthday_day

		return (
			<div className="urgent_friend" key={friend.id}>
				<img
					src={String(friend.profile_image_path)}
					alt={friend.name}
				/>

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
						<button className="ignore">Ignore</button>
						<button className="mark_completed">
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
		<div id="urgentFriendsSection">
			<h2>Today you should reach out to..</h2>

			<div id="urgentCards">{MostUrgentFriends}</div>
		</div>
	)
}

const Upcoming: React.FC = () => {
	return <></>
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
				<Upcoming />
			</div>
		</div>
	)
}

export default Home
