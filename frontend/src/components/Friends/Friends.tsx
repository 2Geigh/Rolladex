import { useSearchParams } from "react-router-dom"
import React, { useLayoutEffect, useState } from "react"
import {
	type Friend,
	GetRelationshipTierInfo,
	MAX_NUMBER_OF_FRIENDS,
	type RelationshipTier,
} from "../../types/models/Friend"
import { backend_base_url } from "../../util/url"
import Loading from "../Loading/Loading"
import "./styles/Friends.css"
import { GetZodiac, MonthNumberToString } from "../../util/dates"
import type { JSX } from "react"
import type { SetURLSearchParams } from "react-router-dom"

type SortByProps = {
	validSortParams: string[]
	validSortParamLabels: Record<string, string>
	searchParams: URLSearchParams
	setSearchParams: SetURLSearchParams
}
const SortBy: React.FC<SortByProps> = ({
	validSortParams,
	validSortParamLabels,
	searchParams,
	setSearchParams,
}) => {
	const selected = searchParams.get("sortby")!

	function onSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const { value } = event.target

		searchParams.set("sortby", value)
		searchParams.set("page", "1")
		setSearchParams(searchParams)
	}

	const Options = validSortParams.map((sortby) => (
		<option value={sortby} key={sortby}>
			{validSortParamLabels[String(sortby)]}
		</option>
	))

	return (
		<div className="sortBy">
			<select
				name="sortby"
				id="sortbyOptions"
				value={selected}
				onChange={onSortChange}
			>
				{Options}
			</select>
			<label htmlFor="sortby" id="sortby">
				Sort by:
			</label>
		</div>
	)
}

type getFriendsProps = {
	sortBy: string
}
async function getFriends({ sortBy }: getFriendsProps): Promise<Array<Friend>> {
	let friends: Array<Friend> = []

	try {
		const response = await fetch(
			`${backend_base_url}/friends?sortby=${sortBy}`,
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

type PageNavProps = {
	numberOfPages: number
	searchParams: URLSearchParams
	setSearchParams: SetURLSearchParams
}
const PageNav: React.FC<PageNavProps> = ({
	numberOfPages,
	searchParams,
	setSearchParams,
}) => {
	const pageNumber = parseInt(searchParams.get("page")!)

	const pageNumbers: Array<number> = []
	for (let i = 1; i <= numberOfPages; i++) {
		pageNumbers.push(i)
	}
	const PageSelectOptions = pageNumbers.map((pageNum) => (
		<option value={pageNum} key={pageNum}>
			{pageNum}
		</option>
	))

	function onSelectPageNumber(e: React.ChangeEvent<HTMLSelectElement>) {
		const selectValue = e.target.value
		const pageNum = parseInt(selectValue, 10)

		if (isNaN(pageNum) || pageNum < 1) {
			searchParams.set("page", "1")
			setSearchParams(searchParams)
		} else {
			searchParams.set("page", String(pageNum))
			setSearchParams(searchParams)
		}
	}

	function goToNextPage() {
		if (pageNumber < numberOfPages) {
			// navigate(`/friends?sortby=${sortBy}&page=${pageNumber + 1}`)

			const pageNum = parseInt(searchParams.get("page")!)
			searchParams.set("page", String(pageNum + 1))
			setSearchParams(searchParams)
		}
	}

	function goToPreviousPage() {
		if (pageNumber > 1) {
			// navigate(`/friends?sortby=${sortBy}&page=${pageNumber - 1}`)

			const pageNum = parseInt(searchParams.get("page")!)
			searchParams.set("page", String(pageNum - 1))
			setSearchParams(searchParams)
		}
	}

	return (
		<div id="pagenav">
			{pageNumber > 1 && numberOfPages > 1 ?
				<div className="arrow" id="left" onClick={goToPreviousPage}>
					〈
				</div>
			:	<div className="blocked" id="left"></div>}
			<select
				name="page"
				id="pageSelect"
				onChange={onSelectPageNumber}
				value={pageNumber}
			>
				{PageSelectOptions}
			</select>
			{pageNumber < numberOfPages && numberOfPages > 1 ?
				<div className="arrow" id="right" onClick={goToNextPage}>
					〉
				</div>
			:	<div className="blocked" id="right"></div>}
		</div>
	)
}

type TableProps = {
	FriendListItems: JSX.Element[]
}
const Table: React.FC<TableProps> = ({ FriendListItems }) => {
	return (
		<table
			id="friendList"
			className={!FriendListItems?.length ? "noFriends" : undefined}
		>
			<thead
				className={!FriendListItems?.length ? "noFriends" : undefined}
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
	)
}

const Friends: React.FC = () => {
	const [friends, setFriends] = useState<Array<Friend>>([])
	const [isLoading, setIsLoading] = useState(true)

	// const query = new URLSearchParams(useLocation().search)
	const validSortParams = [
		"name",
		"last_interaction_date",
		"relationship_tier",
		"birthday",
		"created_at",
	]
	const validSortParamLabels = {
		name: "Name",
		last_interaction_date: "Last interaction date",
		relationship_tier: "Relationship",
		birthday: "Birthday",
		created_at: "Date added",
	}
	const [searchParams, setSearchParams] = useSearchParams({
		sortby: "name",
		page: "1",
	})

	const [numberOfFriendsPerPage] = useState<number>(25)
	const [numberOfPages, setNumberOfPages] = useState<number>(1)

	const index_start =
		numberOfFriendsPerPage * (parseInt(searchParams.get("page")!) - 1)
	const index_end = index_start + numberOfFriendsPerPage
	const friendsForTheCurrentPage: Friend[] =
		friends !== null ? friends.slice(index_start, index_end) : []
	const FriendListItems = friendsForTheCurrentPage?.map((friend) => {
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

		let birthday: { month: number | null; day: number | null } = {
			month: null,
			day: null,
		}
		if (friend.birthday_day) {
			birthday = { ...birthday, day: friend.birthday_day }
		}
		if (friend.birthday_month) {
			birthday = { ...birthday, month: friend.birthday_month }
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
					<div className="cell_content">
						<div className="emoji">{relationshipTier.emoji}</div>
						{/* <br></br> */}
						<div className="relationship_title">
							{relationshipTier.name}
						</div>
					</div>
				</td>

				<td className="last_interaction">
					<a href={`/interactions/${last_interaction_id}`}>
						{formatted_interaction_column_text}
					</a>
				</td>
				<td className="birthday">
					<div className="birthday_content">
						<span className="birthday_string">
							{birthday.month && birthday.day ?
								<>
									<span className="month">
										{MonthNumberToString(birthday.month)}
									</span>{" "}
									<span className="day">{birthday.day}</span>
								</>
							:	<>Unknown</>}
						</span>
						<div className="emoji">
							{
								GetZodiac(birthday.month, birthday.day)
									.zodiacEmoji
							}
						</div>
					</div>
				</td>
				<td className="created_at">{formatted_created_at}</td>
			</tr>
		)
	})

	useLayoutEffect(() => {
		const sortBy = searchParams.get("sortby")!
		getFriends({ sortBy })
			.then((friendArray) => {
				setFriends(friendArray)

				const numberOfFriends =
					friendArray !== null ? friendArray.length : 0
				const totalPageNum = Math.ceil(
					numberOfFriends / numberOfFriendsPerPage,
				)
				setNumberOfPages(totalPageNum)

				if (
					isNaN(parseInt(searchParams.get("page")!)) ||
					parseInt(searchParams.get("page")!) < 1 ||
					parseInt(searchParams.get("page")!) > totalPageNum
				) {
					searchParams.set("page", "1")
					setSearchParams(searchParams)
				}
			})
			.then(() => {
				if (searchParams.get("sortby") === "default") {
					searchParams.set("sortby", "name")
					setSearchParams(searchParams)
				}
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [searchParams])

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
					<h2>Your network</h2>

					<div className="subheader">
						<a id="addFriend" href="/addfriend">
							Add person
						</a>

						{FriendListItems && FriendListItems?.length > 0 && (
							<SortBy
								validSortParams={validSortParams}
								validSortParamLabels={validSortParamLabels}
								searchParams={searchParams}
								setSearchParams={setSearchParams}
							/>
						)}
					</div>
				</header>

				<Table FriendListItems={FriendListItems} />
			</div>
			{numberOfPages > 1 ?
				<PageNav
					numberOfPages={numberOfPages}
					searchParams={searchParams}
					setSearchParams={setSearchParams}
				/>
			:	<></>}
		</div>
	)
}

export default Friends
