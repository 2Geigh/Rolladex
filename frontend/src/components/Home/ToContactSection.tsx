import { useLayoutEffect, useState } from "react"
import type { Friend } from "../../types/models/Friend"
import { backend_base_url } from "../../util/url"

async function getTopFiveContacts() {
	let urgentFriends: Array<Friend> = []

	try {
		const response = await fetch(`${backend_base_url}/friends/urgent`, {
			method: "GET",
			credentials: "include",
		})

		if (!response.ok) {
			throw new Error(`${response.status}: ${await response.text()}`)
		}

		const data = await response.json()
		urgentFriends = data as Array<Friend>
	} catch (err) {
		throw new Error(String(err))
	}

	return urgentFriends
}

type MostUrgentFriendProps = {
	mostUrgentFriend: Friend
}
const MostUrgentFriend: React.FC<MostUrgentFriendProps> = ({
	mostUrgentFriend,
}) => {
	return (
		<div className="mostUrgentToContact">
			<span className="name">{mostUrgentFriend.name}</span>
		</div>
	)
}

type UrgentFriendsProps = {
	urgentFriends: Array<Friend>
}
const UrgentFriends: React.FC<UrgentFriendsProps> = ({ urgentFriends }) => {
	const mostUrgentFriend = urgentFriends[0]

	return (
		<>
			Today, you should contact:
			<MostUrgentFriend mostUrgentFriend={mostUrgentFriend} />
		</>
	)
}

export const ToContactSection: React.FC = () => {
	const [urgentFriends, setUrgentFriends] = useState<Array<Friend>>([])
	const [isLoading, setIsLoading] = useState(true)

	useLayoutEffect(() => {
		getTopFiveContacts()
			.then((mostUrgentFriends) => {
				setUrgentFriends(mostUrgentFriends)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return <>LOADING...</>
	}

	return <UrgentFriends urgentFriends={urgentFriends} />
}

export default ToContactSection
