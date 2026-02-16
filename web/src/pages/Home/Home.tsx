import React, { useEffect, useState } from 'react'
import { useLoginSessionContext } from '../../contexts/LoginSession'
import './styles/Home.scss'
import { GetRelationshipTierInfo, type Friend } from '../../types/models/Friend'
import { backend_base_url } from '../../util/url'
import type { JSX } from 'react'

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
	if (friends) {
		MostUrgentFriends = friends.map((friend) => {
			return (
				<div
					className='urgent_friend'
					id={friends.indexOf(friend) == 0 ? 'mostUrgent' : ''}
					key={friend.id}
				>
					<a className='image_a' href={`/friends/${friend.id}`}>
						<img
							src={friend.profile_image_path}
							alt={
								GetRelationshipTierInfo(
									friend.relationship_tier
								).emoji
							}
						/>
					</a>

					<div className='body'>
						<div className='top'>
							<a className='name' href={`/friends/${friend.id}`}>
								{friend.name}
							</a>
							<div className='relationship_tier_emoji'>
								{
									GetRelationshipTierInfo(
										friend.relationship_tier
									).emoji
								}
							</div>
						</div>
						{friends.indexOf(friend) == 0 ?
							<>
								<div className='middle'>
									Last interaction:&nbsp;
									<span className='time_ago'>
										{friend.days_since_last_interaction}{' '}
										days ago
									</span>
								</div>
								<div className='bottom'>
									<button>Update</button>
								</div>
							</>
						:	<>
								<div className='bottom'>
									<span>
										Last interaction:&nbsp;
										<span className='time_ago'>
											{friend.days_since_last_interaction}{' '}
											days ago
										</span>
									</span>
									<button>Update</button>
								</div>
							</>
						}
					</div>
				</div>
			)
		})
	}

	const NoFriends = (
		<div id='noFriends'>
			<span className='emoji'>🗿</span>
			<span>No pending communications.</span>
			<a href='/addfriend'>View all friends</a>
		</div>
	)

	if (isLoading) {
		return <>Loading...</>
	}

	return (
		<div id='urgentFriendsSection' className='homeSection'>
			<h2>
				{new Date().toLocaleDateString('en-CA', {
					month: 'long',
					day: 'numeric',
					weekday: 'long',
				})}
			</h2>

			{MostUrgentFriends.length < 1 ?
				NoFriends
			:	<>
					<div id='urgentCards'>{MostUrgentFriends}</div>
				</>
			}

			{MostUrgentFriends.length < 1 ?
				<></>
			:	<a id='toFriends' href='/friends'>
					View all friends
				</a>
			}
		</div>
	)
}

type NotificationsProps = {
	notifications: Notification[]
}
const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
	let notificationElements: JSX.Element[] = []
	if (notifications) {
		notificationElements = notifications.map((notification, key) => {
			return (
				<div className='notification' key={key}>
					<input type='checkbox' name='dismissed' id='dismissed' />
					<div className='body'>
						<div className='top'>
							<div className='date'>
								Jan. 31{' '}
								<span className='proximity'>(3 days)</span>
							</div>
							<div className='emoji'>
								{(
									notification.text
										.toLowerCase()
										.includes('birthday')
								) ?
									'🎉'
								:	'👤'}
							</div>
						</div>
						<div className='bottom'>{notification.text}</div>
					</div>
				</div>
			)
		})
	}

	return (
		<div id='upcomingSection' className='homeSection'>
			<h2>Upcoming&hellip;</h2>

			{notificationElements.length < 1 ?
				<div id='caughtUp'>
					<span>🥂</span>
					All caught up!
				</div>
			:	<div id='notifications'>{notificationElements}</div>}
		</div>
	)
}

const Home: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [homepageContent, setHomepageContent] = useState<HomepageContent>({
		todaysFriends: [],
		notifications: [],
	})

	async function getUpcomingUrgentFriends(): Promise<HomepageContent> {
		const response = await fetch(`${backend_base_url}/home`, {
			method: 'GET',
			credentials: 'include',
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
		<div id='homeContent'>
			{loginSessionContext.user ?
				<h1>Hello, {loginSessionContext.user?.username}.</h1>
			:	<h1>Good afternoon.</h1>}

			<div id='homeSections'>
				<UrgentFriends
					isLoading={isLoading}
					friends={homepageContent.todaysFriends}
				/>
				<Notifications notifications={homepageContent.notifications} />
			</div>
		</div>
	)
}

export default Home
