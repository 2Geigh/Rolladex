import React, { useEffect, useState } from 'react'
import { type LoginSessionData } from '../../contexts/LoginSession'
import './styles/Home.scss'
import { GetRelationshipTierInfo, type Friend } from '../../types/models/Friend'
import { backend_base_url } from '../../util/url'
import type { JSX } from 'react'
import { DaysSinceDate } from '../../util/dates'
import { Link } from 'react-router-dom'

type Notification = {
	date: Date
	text: string
	friend_id: number
}

type HomepageContent = {
	todaysFriends: Friend[]
	notifications: Notification[]
}

type UrgentFriendProps = {
	index: number
	friend: Friend
}
const UrgentFriend: React.FC<UrgentFriendProps> = ({ index, friend }) => {
	return (
		<div
			className='urgent_friend'
			id={index == 0 ? 'mostUrgent' : ''}
			key={`${friend.id}_${friend.name}`}
		>
			<Link className='image_a' to={`/friends/${friend.id}`}>
				<img
					src={friend.profile_image_path}
					alt={
						GetRelationshipTierInfo(friend.relationship_tier).emoji
					}
				/>
			</Link>

			<div className='body'>
				<div className='top'>
					<Link className='name' to={`/friends/${friend.id}`}>
						{friend.name}
					</Link>
					<div className='relationship_tier_emoji'>
						{
							GetRelationshipTierInfo(friend.relationship_tier)
								.emoji
						}
					</div>
				</div>
				{index == 0 ?
					<>
						<div className='middle'>
							Last interaction:&nbsp;
							<span className='time_ago'>
								{friend.days_since_last_interaction} days ago
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
									{friend.days_since_last_interaction} days
									ago
								</span>
							</span>
							<button>Update</button>
						</div>
					</>
				}
			</div>
		</div>
	)
}

type UrgentFriendsProps = {
	date: Date
	friends: Friend[]
	isLoading: boolean
}
const UrgentFriends: React.FC<UrgentFriendsProps> = ({
	date,
	friends,
	isLoading,
}) => {
	let MostUrgentFriends: JSX.Element[] = []
	if (friends) {
		MostUrgentFriends = friends.map((friend) => {
			return (
				<UrgentFriend
					key={friend.id}
					index={friends.indexOf(friend)}
					friend={friend}
				/>
			)
		})
	}

	const NoFriends: JSX.Element = (
		<div id='noFriends'>
			<span className='emoji'>🗿</span>
			<span>No pending communications.</span>
			<Link to='/friends'>View all friends</Link>
		</div>
	)

	if (isLoading) {
		return <>Loading...</>
	}

	return (
		<div id='urgentFriendsSection' className='homeSection'>
			<h2>
				{date.toLocaleDateString('en-CA', {
					month: 'long',
					day: 'numeric',
					weekday: 'long',
				})}
			</h2>

			{MostUrgentFriends.length < 1 ?
				NoFriends
			:	<div id='urgentCards'>{MostUrgentFriends}</div>}

			{MostUrgentFriends.length > 1 && (
				<Link id='toFriends' to='/friends'>
					View all friends
				</Link>
			)}
		</div>
	)
}

type NotificationProps = {
	notification: Notification
}
const Notification: React.FC<NotificationProps> = ({ notification }) => {
	return (
		<div className='notification'>
			<input type='checkbox' name='dismissed' id='dismissed' />
			<div className='body'>
				<div className='top'>
					<div className='date'>
						{new Date(notification.date).toLocaleDateString(
							'en-ca',
							{ month: 'short', day: 'numeric' }
						)}{' '}
						<span className='proximity'>
							(
							{Math.abs(
								DaysSinceDate(new Date(notification.date))
							)}{' '}
							days ahead)
						</span>
					</div>
					<div className='emoji'>
						{notification.text.toLowerCase().includes('birthday') ?
							'🎉'
						:	'👤'}
					</div>
				</div>
				<div className='bottom'>{notification.text}</div>
			</div>
		</div>
	)
}

type NotificationsProps = {
	notifications: Notification[]
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
	let notificationElements: JSX.Element[] = []
	if (notifications) {
		notificationElements = notifications.map((notification) => {
			return (
				<Notification
					key={`${notification.date}_${notification.friend_id}`}
					notification={notification}
				/>
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

type HomeProps = {
	loginSessionContext: LoginSessionData
}
const Home: React.FC<HomeProps> = ({ loginSessionContext }) => {
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
					date={new Date()}
					isLoading={isLoading}
					friends={homepageContent.todaysFriends}
				/>
				<Notifications notifications={homepageContent.notifications} />
			</div>
		</div>
	)
}

export default Home
