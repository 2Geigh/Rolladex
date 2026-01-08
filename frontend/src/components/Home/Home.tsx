import { useEffect, useState } from "react"
import "./styles/dist/Home.min.css"
import ToContactSection from "./ToContactSection"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import type { Interaction } from "../../types/models/Interaction"
import { backend_base_url } from "../../util/url"

async function getLastMonthsActivity(): Promise<
	Array<Interaction> | undefined
> {
	let lastMonthsActivity: Array<Interaction> = []

	try {
		const response = await fetch(
			`${backend_base_url}/interactions/pastmonth"`,
			{
				method: "GET",
				credentials: "include",
			},
		)

		if (!response.ok) {
			throw new Error(`${response.status}: ${await response.text()}`)
		}

		const data = await response.json()
		lastMonthsActivity = data as Array<Interaction>
	} catch (err) {
		throw new Error(String(err))
	}

	if (
		lastMonthsActivity === null ||
		lastMonthsActivity === undefined ||
		lastMonthsActivity.length < 1
	) {
		return undefined
	}

	return lastMonthsActivity
}

const ActivitySection: React.FC = () => {
	const [activityForLastMonth, setActivityForLastMonth] = useState<
		Array<Interaction> | undefined
	>(undefined)

	useEffect(() => {
		getLastMonthsActivity()
			.then((lastMonthsActivity) => {
				setActivityForLastMonth(lastMonthsActivity)
			})
			.catch((err) => {
				throw new Error(err)
			})
	}, [])

	return (
		<div className="section" id="ActivitySection">
			<span className="title">Log</span>
			<div>{String(activityForLastMonth)}</div>
			{/* <div id="calendar">
				<div className="header">
					<select></select>
				</div>
			</div> */}
			<Calendar />
		</div>
	)
}

const Home: React.FC = () => {
	return (
		<>
			<div id="home">
				<ToContactSection />
				<ActivitySection />
			</div>
		</>
	)
}

export default Home
