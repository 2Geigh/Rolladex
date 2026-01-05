import "./styles/dist/Home.min.css"
import { GetRelationshipTierInfo, type Friend } from "../../types/models/Friend"
import { backend_base_url } from "../../util/url"
import { useState, useEffect } from "react"
import { TimeAgo } from "../../util/dates"

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

type ContactProps = {
	name: string
	profile_image_source: string | undefined
	last_interaction_date: Date | undefined
	relationship_tier: number | undefined
}

const LessUrgentContact: React.FC<ContactProps> = ({
	name,
	profile_image_source,
	last_interaction_date,
	relationship_tier,
}) => {
	const relationshipTier = GetRelationshipTierInfo(relationship_tier)
	const timeSince = TimeAgo(last_interaction_date)
	return (
		<div className="contactCard lessUrgent">
			<img src={profile_image_source} alt={name} />
			<div className="text">
				<div className="heading">
					<span className="name">{name}</span>
					<span className="friendship_tier">{`${relationshipTier.emoji} ${relationshipTier.name}`}</span>
				</div>
				<div className="body">
					<div className="dayssincelastcontact">
						<span className="timespan">{timeSince}</span>
						<span className="ago">since last contact</span>
					</div>
					<button className="contact">Reach out</button>
				</div>
			</div>
		</div>
	)
}

const MostUrgentContact: React.FC<ContactProps> = ({
	name,
	profile_image_source,
	last_interaction_date,
	relationship_tier,
}) => {
	const relationshipTier = GetRelationshipTierInfo(relationship_tier)
	const timeSince = TimeAgo(last_interaction_date)
	return (
		<div className="mostUrgentContact">
			<span className="prompt">🚨 Today you should contact</span>
			<div className="contactCard urgent">
				<img src={profile_image_source} alt={name} />
				<div className="text">
					<div className="heading">
						<span className="name">{name}</span>
						<span className="friendship_tier">{`${relationshipTier.emoji} ${relationshipTier.name}`}</span>
					</div>
					<div className="body">
						<div className="dayssincelastcontact">
							<span className="timespan">{timeSince}</span>
							<span className="ago">since last contact</span>
						</div>
						<button className="contact">Reach out now!</button>
					</div>
				</div>
			</div>
		</div>
	)
}

const ToContactSection: React.FC = () => {
	const [urgentFriends, setUrgentFriends] = useState<Array<Friend>>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		getTopFiveContacts()
			.then((mostUrgentFriends) => {
				setUrgentFriends(mostUrgentFriends)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	if (urgentFriends == null) {
		return (
			<>
				<div className="section" id="ToContactSection">
					<span id="nobody">
						<span className="emoji">🎊</span>
						<span className="text">
							Looks like you're all caught up!
						</span>
					</span>

					<a className="toAddFriend" href="/friends">
						View all friends
					</a>
				</div>
			</>
		)
	}
	const mostUrgentFriend = urgentFriends[0]

	const lessUrgentFriends = urgentFriends.slice(1)
	const lessUrgentContacts = lessUrgentFriends.map((friend) => (
		<LessUrgentContact
			name={friend.name}
			profile_image_source={friend.profile_image_path}
			last_interaction_date={friend.last_interaction_date}
			relationship_tier={friend.relationship_tier}
			key={friend.id}
		/>
	))

	if (isLoading) {
		return <>LOADING</>
	}

	return (
		<div className="section" id="ToContactSection">
			<MostUrgentContact
				name={mostUrgentFriend.name}
				profile_image_source={mostUrgentFriend.profile_image_path}
				last_interaction_date={mostUrgentFriend.last_interaction_date}
				relationship_tier={mostUrgentFriend.relationship_tier}
			/>

			<hr />

			{lessUrgentContacts}

			<a href="/friends">View all friends</a>
		</div>
	)
}

const Home: React.FC = () => {
	return (
		<>
			<div id="home">
				<ToContactSection />
				<div className="section" id="ActivitySection"></div>
			</div>
		</>
	)
}

export default Home
