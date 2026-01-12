import { useState } from "react"
import {
	DefaultRelationshipTiers,
	GetRelationshipTierInfo,
} from "../../types/models/Friend"
import "./styles/dist/AddFriends.min.css"
import { backend_base_url } from "../../util/url"

type OptionalProps = {
	friendName: string
}
const Optional: React.FC<OptionalProps> = ({ friendName }) => {
	const [month, setMonth] = useState<string | null>(null)
	const [day, setDay] = useState<string | null>(null)

	function getMaxDaysInMonth(month: string | null) {
		if (!month) {
			return 31
		}

		if (month === "02") return 29

		if (["04", "06", "09", "11"].includes(month)) return 30

		return 31
	}

	function getZodiac(
		month: string | null,
		day: string | null,
	): Record<string, string> {
		if (!month || !day)
			return { zodiacName: "No birthday selected yet", zodiacEmoji: "🎂" }

		const dayNumber = parseInt(day, 10)
		if (month === "01")
			return dayNumber < 20 ?
					{ zodiacName: "Capricorn", zodiacEmoji: "🐐" }
				:	{ zodiacName: "Aquarius", zodiacEmoji: "🏺" }
		if (month === "02")
			return dayNumber < 19 ?
					{ zodiacName: "Aquarius", zodiacEmoji: "🏺" }
				:	{ zodiacName: "Pisces", zodiacEmoji: "🐟" }
		if (month === "03")
			return dayNumber < 21 ?
					{ zodiacName: "Pisces", zodiacEmoji: "🐟" }
				:	{ zodiacName: "Aries", zodiacEmoji: "🐏" }
		if (month === "04")
			return dayNumber < 20 ?
					{ zodiacName: "Aries", zodiacEmoji: "🐏" }
				:	{ zodiacName: "Taurus", zodiacEmoji: "🐂" }
		if (month === "05")
			return dayNumber < 21 ?
					{ zodiacName: "Taurus", zodiacEmoji: "🐂" }
				:	{ zodiacName: "Gemini", zodiacEmoji: "👯" }
		if (month === "06")
			return dayNumber < 21 ?
					{ zodiacName: "Gemini", zodiacEmoji: "👯" }
				:	{ zodiacName: "Cancer", zodiacEmoji: "🦀" }
		if (month === "07")
			return dayNumber < 23 ?
					{ zodiacName: "Cancer", zodiacEmoji: "🦀" }
				:	{ zodiacName: "Leo", zodiacEmoji: "🦁" }
		if (month === "08")
			return dayNumber < 23 ?
					{ zodiacName: "Leo", zodiacEmoji: "🦁" }
				:	{ zodiacName: "Virgo", zodiacEmoji: "🍒" }
		if (month === "09")
			return dayNumber < 23 ?
					{ zodiacName: "Virgo", zodiacEmoji: "🍒" }
				:	{ zodiacName: "Libra", zodiacEmoji: "⚖️" }
		if (month === "10")
			return dayNumber < 23 ?
					{ zodiacName: "Libra", zodiacEmoji: "⚖️" }
				:	{ zodiacName: "Scorpio", zodiacEmoji: "🦂" }
		if (month === "11")
			return dayNumber < 22 ?
					{ zodiacName: "Scorpio", zodiacEmoji: "🦂" }
				:	{ zodiacName: "Sagittarius", zodiacEmoji: "🏹" }
		if (month === "12")
			return dayNumber < 22 ?
					{ zodiacName: "Sagittarius", zodiacEmoji: "🏹" }
				:	{ zodiacName: "Capricorn", zodiacEmoji: "🐐" }

		return {}
	}

	const maxDays = getMaxDaysInMonth(month)

	return (
		<div id="optional">
			<legend>Optional</legend>

			<div id="birthday" className="section">
				<label htmlFor="birthday">{friendName}'s birthday</label>

				<div className="formField">
					<select
						name="birthday_month"
						id="birthdayMonth"
						onChange={(e) => setMonth(e.target.value)}
						defaultValue={""}
					>
						<option id="defaultMonth" disabled selected value="">
							Month
						</option>
						<option value="01">January</option>
						<option value="02">February</option>
						<option value="03">March</option>
						<option value="04">April</option>
						<option value="05">May</option>
						<option value="06">June</option>
						<option value="07">July</option>
						<option value="08">August</option>
						<option value="09">September</option>
						<option value="10">October</option>
						<option value="11">November</option>
						<option value="12">December</option>
					</select>
					<select
						name="birthday_day"
						id="birthdayDay"
						onChange={(e) => {
							setDay(e.target.value)
						}}
					>
						<option id="defaultDay" disabled selected value="">
							Day
						</option>
						{Array.from({ length: maxDays }, (_, index) => (
							<option
								key={index + 1}
								value={String(index + 1).padStart(2, "0")}
							>
								{index + 1}
							</option>
						))}
					</select>
					<div
						id="zodiacEmoji"
						title={getZodiac(month, day).zodiacName}
					>
						{getZodiac(month, day).zodiacEmoji}
					</div>
				</div>
			</div>
		</div>
	)
}

type RelationshipTierDescriptionProps = {
	relationship_tier_code: number | undefined
	hasInputtedRelationshipTier: boolean
}
const RelationshipTierDescription: React.FC<
	RelationshipTierDescriptionProps
> = ({ relationship_tier_code, hasInputtedRelationshipTier }) => {
	const relationship_tier = GetRelationshipTierInfo(relationship_tier_code)

	return (
		<p className="relationship_tier_description">
			{hasInputtedRelationshipTier ?
				relationship_tier.description + "."
			:	"Hover over a relationship type to see its description."}
		</p>
	)
}

type RelationshipTierSelectOptionsProps = {
	hasInputtedRelationshipTier: boolean
	setHasInputtedRelationshipTier: React.Dispatch<
		React.SetStateAction<boolean>
	>
	currentlySelectedRelationshipTier: number | undefined
	setCurrentlySelectedRelationshipTier: React.Dispatch<
		React.SetStateAction<number | undefined>
	>
	lastHoveredRelationshipTier: number | undefined
	setLastHoveredRelationshipTier: React.Dispatch<
		React.SetStateAction<number | undefined>
	>
}
const RelationshipTierSelectOptions = ({
	hasInputtedRelationshipTier,
	setHasInputtedRelationshipTier,
	currentlySelectedRelationshipTier,
	setCurrentlySelectedRelationshipTier,
	lastHoveredRelationshipTier,
	setLastHoveredRelationshipTier,
}: RelationshipTierSelectOptionsProps) => {
	const options = Object.values(DefaultRelationshipTiers).map(
		(relationship_tier) => {
			const name = "relationship_tier"
			const inputValue = relationship_tier.code
			const inputId = relationship_tier.name.replace(/\s+/g, "")
			const labelFor = inputId
			const labelInnerHtml = `${relationship_tier.emoji} ${relationship_tier.name}`

			return (
				<div key={inputValue} className="relationshipLabelAndRadio">
					<input
						name={name}
						required
						type="radio"
						value={relationship_tier.code}
						id={inputId}
						onChange={() => {
							if (!hasInputtedRelationshipTier) {
								setHasInputtedRelationshipTier(true)
							}

							setCurrentlySelectedRelationshipTier(
								relationship_tier.code,
							)
						}}
					/>

					<label
						htmlFor={labelFor}
						onMouseEnter={() => {
							setLastHoveredRelationshipTier(
								relationship_tier.code,
							)
							console.log(
								`\nlastHoveredRelationshipTier: ${lastHoveredRelationshipTier}\ncurrentlySelectedRelationshipTier: ${currentlySelectedRelationshipTier}`,
							)
						}}
						className={
							(
								currentlySelectedRelationshipTier !==
									undefined &&
								currentlySelectedRelationshipTier ===
									relationship_tier.code
							) ?
								"selected"
							:	""
						}
					>
						{labelInnerHtml}
					</label>
				</div>
			)
		},
	)

	return <div className="options">{options}</div>
}

type RelationshipSectionProps = {
	friendName: string
	hasInputtedRelationshipTier: boolean
	setHasInputtedRelationshipTier: React.Dispatch<
		React.SetStateAction<boolean>
	>
	currentlySelectedRelationshipTier: number | undefined
	setCurrentlySelectedRelationshipTier: React.Dispatch<
		React.SetStateAction<number | undefined>
	>
	lastHoveredRelationshipTier: number | undefined
	setLastHoveredRelationshipTier: React.Dispatch<
		React.SetStateAction<number | undefined>
	>
}
const RelationshipSection: React.FC<RelationshipSectionProps> = ({
	friendName,
	hasInputtedRelationshipTier,
	setHasInputtedRelationshipTier,
	currentlySelectedRelationshipTier,
	setCurrentlySelectedRelationshipTier,
	lastHoveredRelationshipTier,
	setLastHoveredRelationshipTier,
}) => {
	const [wantsToKnowWhy, setWantsToKnowWhy] = useState<boolean>(false)

	return (
		<div className="section" id="relationshipTier">
			<div className="fieldset_content">
				<label className="selectionPrompt">
					Please select the level of friendship you want to maintain
					with {friendName}&nbsp;
					<span
						className="why"
						onClick={() => {
							setWantsToKnowWhy(!wantsToKnowWhy)
						}}
					>
						(why?)
					</span>
				</label>
				{wantsToKnowWhy ?
					<div id="algorithmExplanation">
						<p>
							In consectetur sint nam nobis non. Exercitationem
							voluptatum sit recusandae aspernatur velit. Aut
							commodi natus laboriosam. Minus iste aut ipsum
							quasi. Consequuntur deleniti cumque explicabo et
							culpa tempore laudantium.
						</p>
						<span
							className="close"
							onClick={() => {
								setWantsToKnowWhy(!wantsToKnowWhy)
							}}
						>
							Close
						</span>
					</div>
				:	<></>}
				<div className="tiersAndInfo">
					<RelationshipTierDescription
						relationship_tier_code={lastHoveredRelationshipTier}
						hasInputtedRelationshipTier={
							hasInputtedRelationshipTier
						}
					/>
					<RelationshipTierSelectOptions
						hasInputtedRelationshipTier={
							hasInputtedRelationshipTier
						}
						setHasInputtedRelationshipTier={
							setHasInputtedRelationshipTier
						}
						currentlySelectedRelationshipTier={
							currentlySelectedRelationshipTier
						}
						setCurrentlySelectedRelationshipTier={
							setCurrentlySelectedRelationshipTier
						}
						lastHoveredRelationshipTier={
							lastHoveredRelationshipTier
						}
						setLastHoveredRelationshipTier={
							setLastHoveredRelationshipTier
						}
					/>
				</div>
			</div>
		</div>
	)
}

type LastInteractionInputsProps = {
	friendName: string
	knowsApproximateLastInteraction: boolean | undefined
	setKnowsApproximateLastInteraction: React.Dispatch<
		React.SetStateAction<boolean | undefined>
	>
	knowsAbsoluteLastInteraction: boolean | undefined
	setKnowsAbsoluteLastInteraction: React.Dispatch<
		React.SetStateAction<boolean | undefined>
	>
	hasInputtedLastInteractionDate: boolean
	setHasInputtedLastInteractionDate: React.Dispatch<
		React.SetStateAction<boolean>
	>
}
const LastInteractionInputs: React.FC<LastInteractionInputsProps> = ({
	friendName,
	knowsApproximateLastInteraction,
	setKnowsApproximateLastInteraction,
	knowsAbsoluteLastInteraction,
	setKnowsAbsoluteLastInteraction,
	setHasInputtedLastInteractionDate,
}) => {
	function onChangeAbsoluteDate(e: React.ChangeEvent<HTMLInputElement>) {
		setKnowsAbsoluteLastInteraction(true)
		setKnowsApproximateLastInteraction(false)

		const inputtedTimeAgoMultipleElement = document.getElementById(
			"time_unit_multiple",
		) as HTMLInputElement
		inputtedTimeAgoMultipleElement.value = ""

		const inputtedTimeAgoUnitElement = document.getElementById(
			"time_unit",
		) as HTMLSelectElement
		inputtedTimeAgoUnitElement.value = ""

		if (
			e.target.value.trim() !== "" ||
			e.target.value !== null ||
			e.target.value !== undefined
		) {
			setHasInputtedLastInteractionDate(true)
		} else {
			setHasInputtedLastInteractionDate(false)
		}
	}

	function onChangeApproximateDate() {
		setKnowsAbsoluteLastInteraction(false)
		setKnowsApproximateLastInteraction(true)

		const inputtedTimeAgoMultipleElement = document.getElementById(
			"time_unit_multiple",
		) as HTMLInputElement
		console.log(
			`inputtedTimeAgoMultipleElement: ${inputtedTimeAgoMultipleElement.value}`,
		)

		const inputtedTimeAgoUnitElement = document.getElementById(
			"time_unit",
		) as HTMLSelectElement
		console.log(
			`inputtedTimeAgoUnitElement: ${inputtedTimeAgoUnitElement.value}`,
		)

		const inputtedAbsoluteLastInteractionDate = document.getElementById(
			"last_interaction_date_absolute",
		) as HTMLInputElement
		console.log(
			`inputtedAbsoluteLastInteractionDate: ${inputtedAbsoluteLastInteractionDate.value}`,
		)

		if (
			inputtedTimeAgoMultipleElement.value.trim() !== "" &&
			inputtedTimeAgoUnitElement.value.trim() !== ""
		) {
			inputtedAbsoluteLastInteractionDate.value = ""
			setHasInputtedLastInteractionDate(true)
		} else {
			setHasInputtedLastInteractionDate(false)
		}
	}

	function formatDate(date: Date) {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-indexed
		const day = String(date.getDate()).padStart(2, "0")

		return `${year}-${month}-${day}`
	}

	function addOneDay(date: Date) {
		const nextDay = new Date(date)
		nextDay.setDate(nextDay.getDate() + 1)
		return nextDay
	}

	const today = new Date()
	const tomorrow = addOneDay(today)

	return (
		<div className="section" id="lastInteraction">
			<span className="question">
				When did you last meaningfully interact with {friendName}?
			</span>
			<div className="answerContent">
				<div
					className={
						knowsApproximateLastInteraction ? "absolute ignored" : (
							"absolute"
						)
					}
				>
					<label htmlFor="last_interaction_date_absolute">
						Last interaction date
					</label>
					<input
						type="date"
						id="last_interaction_date_absolute"
						onChange={onChangeAbsoluteDate}
						min="1900-01-01"
						max={formatDate(tomorrow)}
					/>
				</div>
				<span className="or">or</span>
				<div
					className={
						knowsAbsoluteLastInteraction ?
							"approximate ignored"
						:	"approximate"
					}
				>
					<span className="inputtedTimeAgo">
						〜{" "}
						<input
							name="time_unit_multiple"
							id="time_unit_multiple"
							type="number"
							min={0}
							max={10000}
							onChange={onChangeApproximateDate}
						/>{" "}
						<select
							name="time_unit"
							id="time_unit"
							defaultValue=""
							onChange={onChangeApproximateDate}
						>
							<option value="" disabled>
								Time units
							</option>
							<option value="hours">Hours</option>
							<option value="days">Days</option>
							<option value="weeks">Weeks</option>
							<option value="months">Months</option>
							<option value="years">Years</option>
						</select>{" "}
						ago
					</span>
				</div>
			</div>
		</div>
	)
}

const AddFriends: React.FC = () => {
	const [friendName, setFriendName] = useState<string>("")
	const [
		knowsApproximateLastInteraction,
		setKnowsApproximateLastInteraction,
	] = useState<boolean | undefined>(undefined)
	const [knowsAbsoluteLastInteraction, setKnowsAbsoluteLastInteraction] =
		useState<boolean | undefined>(undefined)
	const [hasInputtedLastInteractionDate, setHasInputtedLastInteractionDate] =
		useState<boolean>(false)
	const [hasInputtedRelationshipTier, setHasInputtedRelationshipTier] =
		useState<boolean>(false)
	const [
		currentlySelectedRelationshipTier,
		setCurrentlySelectedRelationshipTier,
	] = useState<number | undefined>(undefined)
	const [lastHoveredRelationshipTier, setLastHoveredRelationshipTier] =
		useState<number | undefined>(undefined)

	return (
		<>
			<div id="addFriendsContent">
				<h2>Add a friend</h2>
				<form action={`${backend_base_url}/friends`} method="POST">
					<div id="nameFormField">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							name="name"
							required
							maxLength={64}
							onChange={(e) => {
								const inputtedText = e.target.value
								setFriendName(inputtedText)
							}}
						/>
					</div>

					{friendName.trim() !== "" && (
						<>
							<LastInteractionInputs
								friendName={friendName}
								knowsApproximateLastInteraction={
									knowsApproximateLastInteraction
								}
								setKnowsApproximateLastInteraction={
									setKnowsApproximateLastInteraction
								}
								knowsAbsoluteLastInteraction={
									knowsAbsoluteLastInteraction
								}
								setKnowsAbsoluteLastInteraction={
									setKnowsAbsoluteLastInteraction
								}
								hasInputtedLastInteractionDate={
									hasInputtedLastInteractionDate
								}
								setHasInputtedLastInteractionDate={
									setHasInputtedLastInteractionDate
								}
							/>

							{hasInputtedLastInteractionDate && (
								<>
									<RelationshipSection
										friendName={friendName}
										hasInputtedRelationshipTier={
											hasInputtedRelationshipTier
										}
										setHasInputtedRelationshipTier={
											setHasInputtedRelationshipTier
										}
										currentlySelectedRelationshipTier={
											currentlySelectedRelationshipTier
										}
										setCurrentlySelectedRelationshipTier={
											setCurrentlySelectedRelationshipTier
										}
										lastHoveredRelationshipTier={
											lastHoveredRelationshipTier
										}
										setLastHoveredRelationshipTier={
											setLastHoveredRelationshipTier
										}
									/>

									{hasInputtedRelationshipTier && (
										<>
											<Optional friendName={friendName} />
											<input
												type="submit"
												id="Submit"
												value="Add friend"
											/>
										</>
									)}
								</>
							)}
						</>
					)}
				</form>
			</div>
		</>
	)
}

export default AddFriends
