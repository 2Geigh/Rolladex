import { useSearchParams } from "react-router-dom"
import { useLayoutEffect, useState, type ChangeEventHandler } from "react"
import {
	type Friend,
	GetRelationshipTierInfo,
	MAX_NUMBER_OF_FRIENDS,
	type RelationshipTier,
} from "../../types/models/Friend"
import { backend_base_url } from "../../util/url"
import Loading from "../Loading/Loading"
import "./styles/Friends.css"

function goToNextPage() {}

function goToPreviousPage() {}

type SortByProps = {
	selected: string
	onSortChange: ChangeEventHandler<HTMLSelectElement>
}
const SortBy: React.FC<SortByProps> = ({ selected, onSortChange }) => {
	const validSortQueryParams = [
		"name",
		"last_interaction_date",
		"relationship_tier",
		"birthday",
		"created_at",
	]

	if (!validSortQueryParams.includes(selected)) {
		selected = "name"
	}

	return (
		<div className="sortBy">
			<select
				name="sortby"
				id="sortbyOptions"
				value={selected}
				onChange={onSortChange}
			>
				<option value="name">Name</option>
				<option value="relationship_tier">Relationship</option>
				<option value="last_interaction_date">Last interaction</option>
				{/* <option value="last_meetup_date">Last meetup</option> */}
				<option value="birthday">Birthday</option>
				<option value="created_at">Date added</option>
			</select>
			<label htmlFor="sortby" id="sortby">
				Sort by:
			</label>
		</div>
	)
}

type getFriendsProps = {
	sortBy: string
	pageNumber: number
}
async function getFriends({
	sortBy,
	pageNumber,
}: getFriendsProps): Promise<Array<Friend>> {
	let friends: Array<Friend> = []

	try {
		const response = await fetch(
			`${backend_base_url}/friends?sortby=${sortBy}&page=${pageNumber}`,
			{
				method: "GET",
				credentials: "include",
			},
		)

		if (!response.ok) {
			throw new Error(`${response.status}: ${await response.text()}`)
		}

		const data = await response.json()
		friends = data as Array<Friend>
	} catch (err) {
		throw new Error(String(err))
	}

	return friends
}

const Friends: React.FC = () => {
	// const query = new URLSearchParams(useLocation().search)
	const [friends, setFriends] = useState<Array<Friend> | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(true)
	const [searchParams, setSearchParams] = useSearchParams()

	const sortBy = searchParams.get("sortby") || "default"
	const pageParam = searchParams.get("page") || ""

	const parsedPage = parseInt(pageParam, 10)
	let pageNumber = 1
	if (!isNaN(parsedPage) && parsedPage > 0) {
		pageNumber = parsedPage
	}

	function onSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const { value } = event.target

		setSearchParams({ ...searchParams, sortby: value })
	}

	useLayoutEffect(() => {
		getFriends({ sortBy, pageNumber })
			.then((friendArray) => {
				console.log(friendArray)
				setFriends(friendArray)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [pageNumber, sortBy])

	const FriendListItems = friends?.map((friend) => {
		const name = friend.name
		const friend_id = friend.id
		const last_interaction_id = friend.last_interaction?.id

		let formatted_interaction_column_text: string = ""
		if (friend.last_interaction?.date) {
			const last_interaction_date = new Date(friend.last_interaction.date)
			formatted_interaction_column_text =
				last_interaction_date.toLocaleDateString("en-US", {
					year: "numeric",
					month: "short",
					day: "2-digit",
					weekday: "long",
				})

			if (friend.last_interaction.name) {
				formatted_interaction_column_text = `${friend.last_interaction.name} (${formatted_interaction_column_text})`
			}
		}

		let formatted_birthday: string = ""
		if (friend.birthday) {
			const birthday = new Date(friend.birthday)
			formatted_birthday = birthday.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "2-digit",
			})
		}

		let formatted_created_at: string = ""
		if (friend.created_at) {
			const created_at = new Date(friend.created_at)
			formatted_created_at = created_at.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "2-digit",
			})
		}

		let relationshipTier: RelationshipTier = {
			code: undefined,
			name: "Undefined",
			emoji: "👤",
			description: "Undefined",
			max: MAX_NUMBER_OF_FRIENDS,
		}
		if (friend.relationship_tier)
			relationshipTier = GetRelationshipTierInfo(friend.relationship_tier)

		return (
			<tr key={friend.id}>
				<td className="name">
					<a href={`/friends/${friend_id}`}>{name}</a>
				</td>
				<td className="relationship">
					<div className="emoji">{relationshipTier.emoji}</div>
					<br></br>
					<div className="relationship_title">
						{relationshipTier.name}
					</div>
				</td>

				<td className="last_interaction">
					<a href={`/interactions/${last_interaction_id}`}>
						{formatted_interaction_column_text}
					</a>
				</td>
				<td className="birthday">{formatted_birthday}</td>
				<td className="created_at">{formatted_created_at}</td>
			</tr>
		)
	})

	if (isLoading) {
		return <Loading />
	}

	return (
		<div
			id="friendsContent"
			className={!FriendListItems?.length ? "noFriends" : undefined}
		>
			<div id="friendsWrapper">
				<header
					className={
						!FriendListItems?.length ? "noFriends" : undefined
					}
				>
					<h2>Friends</h2>

					<div className="subheader">
						<a id="addFriend" href="/addfriend">
							Add friend
						</a>

						{/* Show SortBy only if there are friends */}
						{FriendListItems && FriendListItems?.length > 0 && (
							<SortBy
								selected={sortBy}
								onSortChange={onSortChange}
							/>
						)}
					</div>
				</header>

				<table
					id="friendList"
					className={
						!FriendListItems?.length ? "noFriends" : undefined
					}
				>
					<thead
						className={
							!FriendListItems?.length ? "noFriends" : undefined
						}
					>
						<tr className="labels">
							<th id="name">Name</th>
							<th id="relationship">Relationship</th>
							<th id="last_interaction">Last interaction</th>
							<th id="birthday">Birthday</th>
							<th id="created_at">Date added</th>
						</tr>
					</thead>

					<tbody>
						{FriendListItems && FriendListItems?.length > 0 ?
							FriendListItems
						:	<tr id="noFriends">
								<td colSpan={5}>Nobody to be found...</td>
							</tr>
						}
					</tbody>
				</table>
			</div>

			<div id="pagenav">
				<div className="arrow" id="left" onClick={goToPreviousPage}>
					〈
				</div>
				<div className="buttons">
					<a href="/friends" className="button selected">
						1
					</a>
					<a href="/friends" className="button">
						2
					</a>
					<a href="/friends" className="button">
						3
					</a>
					<div className="button" id="ellipsis">
						&#8943;
					</div>
					<a href="/friends" className="button">
						7
					</a>
				</div>
				<div className="arrow" id="right" onClick={goToNextPage}>
					〉
				</div>
			</div>
		</div>
	)
}

export default Friends
