import { useState } from "react"
import {
	DefaultRelationshipTiers,
	GetRelationshipTierInfo,
} from "../../types/models/Friend"
import "./styles/dist/AddFriends.min.css"
import { backend_base_url } from "../../util/url"

const Optional: React.FC = () => {
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

	function getZodiac(month: string | null, day: string | null): string {
		if (!month || !day) return ""

		const dayNumber = parseInt(day, 10)
		if (month === "01") return dayNumber < 20 ? "🐐" : "🏺"
		if (month === "02") return dayNumber < 19 ? "🏺" : "🐟"
		if (month === "03") return dayNumber < 21 ? "🐟" : "🐏"
		if (month === "04") return dayNumber < 20 ? "🐏" : "🐂"
		if (month === "05") return dayNumber < 21 ? "🐂" : "👯"
		if (month === "06") return dayNumber < 21 ? "👯" : "🦀"
		if (month === "07") return dayNumber < 23 ? "🦀" : "🦁"
		if (month === "08") return dayNumber < 23 ? "🦁" : "🍒"
		if (month === "09") return dayNumber < 23 ? "🍒" : "⚖️"
		if (month === "10") return dayNumber < 23 ? "⚖️" : "🦂"
		if (month === "11") return dayNumber < 22 ? "🦂" : " 🏹"
		if (month === "12") return dayNumber < 22 ? " 🏹" : "🐐"

		return ""
	}

	const maxDays = getMaxDaysInMonth(month)

	return (
		<div id="birthday" className="section">
			<legend>Optional</legend>
			<div className="formField">
				<label htmlFor="birthday">Birthday</label>
				<select
					name="birthday_month"
					id="birthdayMonth"
					onChange={(e) => setMonth(e.target.value)}
					defaultValue="01"
				>
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
					{Array.from({ length: maxDays }, (_, index) => (
						<option
							key={index + 1}
							value={String(index + 1).padStart(2, "0")}
						>
							{index + 1}
						</option>
					))}
				</select>
				<div id="zodiacEmoji">{getZodiac(month, day)}</div>
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
				relationship_tier.description
			:	"Not sure which type of relationship to pick? Select one to see a detailed description of it here."
			}
		</p>
	)
}

type RelationshipTierSelectOptionsProps = {
	hasInputtedRelationshipTier: boolean
	setHasInputtedRelationshipTier: React.Dispatch<
		React.SetStateAction<boolean>
	>
	setCurrentlySelectedRelationshipTier: React.Dispatch<
		React.SetStateAction<number | undefined>
	>
}
const RelationshipTierSelectOptions = ({
	hasInputtedRelationshipTier,
	setHasInputtedRelationshipTier,
	setCurrentlySelectedRelationshipTier,
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

					<label htmlFor={labelFor}>{labelInnerHtml}</label>
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
}
const RelationshipSection: React.FC<RelationshipSectionProps> = ({
	friendName,
	hasInputtedRelationshipTier,
	setHasInputtedRelationshipTier,
	currentlySelectedRelationshipTier,
	setCurrentlySelectedRelationshipTier,
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
					<RelationshipTierSelectOptions
						hasInputtedRelationshipTier={
							hasInputtedRelationshipTier
						}
						setHasInputtedRelationshipTier={
							setHasInputtedRelationshipTier
						}
						setCurrentlySelectedRelationshipTier={
							setCurrentlySelectedRelationshipTier
						}
					/>
					<RelationshipTierDescription
						relationship_tier_code={
							currentlySelectedRelationshipTier
						}
						hasInputtedRelationshipTier={
							hasInputtedRelationshipTier
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
		const inputtedTimeAgoUnitElement = document.getElementById(
			"time_unit",
		) as HTMLSelectElement

		const inputtedAbsoluteLastInteractionDate = document.getElementById(
			"last_interaction_date_absolute",
		) as HTMLInputElement
		inputtedAbsoluteLastInteractionDate.value = ""

		if (
			inputtedTimeAgoMultipleElement.value.trim() !== "" ||
			inputtedTimeAgoUnitElement.value.trim() !== ""
		) {
			setHasInputtedLastInteractionDate(true)
		} else {
			setHasInputtedLastInteractionDate(false)
		}
	}

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
						~{" "}
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
							defaultValue="days"
						>
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
									/>

									{hasInputtedRelationshipTier && (
										<>
											<Optional />
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
