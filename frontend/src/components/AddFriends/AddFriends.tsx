import { useEffect, useState } from "react"
import { DefaultRelationshipTiers } from "../../types/models/Friend"
import "./styles/dist/AddFriends.min.css"

const Optional: React.FC = () => {
	return (
		<fieldset>
			<legend>Optional</legend>
			<div className="formField">
				<label htmlFor="birthday">Birthday</label>
				<input type="date" name="birthday" id="birthday" />
			</div>
		</fieldset>
	)
}

type RelationshipTierSelectOptionsProps = RelationshipSectionProps
const RelationshipTierSelectOptions = ({
	hasInputtedRelationshipTier,
	setHasInputtedRelationshipTier,
}: RelationshipTierSelectOptionsProps) => {
	const options = DefaultRelationshipTiers.map((relationship_tier) => (
		<div key={relationship_tier.code} className="relationshipLabelAndRadio">
			<input
				type="radio"
				value={relationship_tier.code}
				onChange={() => {
					if (!hasInputtedRelationshipTier) {
						setHasInputtedRelationshipTier(true)
					}
				}}
			/>

			<label
				htmlFor={String(relationship_tier.code)}
			>{`${relationship_tier.emoji} ${relationship_tier.name}`}</label>
		</div>
	))

	return options
}

type RelationshipSectionProps = {
	hasInputtedRelationshipTier: boolean
	setHasInputtedRelationshipTier: React.Dispatch<
		React.SetStateAction<boolean>
	>
}
const RelationshipSection: React.FC<RelationshipSectionProps> = ({
	hasInputtedRelationshipTier,
	setHasInputtedRelationshipTier,
}) => {
	return (
		<fieldset>
			<legend>Relationship</legend>
			<div className="labelAndInput">
				<label htmlFor="relationshipTierSelect">
					Please select the level of friendship you want to maintain
					with this person:&nbsp;
					<span className="why">(why?)</span>
				</label>
				<RelationshipTierSelectOptions
					hasInputtedRelationshipTier={hasInputtedRelationshipTier}
					setHasInputtedRelationshipTier={
						setHasInputtedRelationshipTier
					}
				/>
			</div>
		</fieldset>
	)
}

type LastInteractionInputsProps = {
	friendName: string
	knowsWhenLastInteractionWas: boolean | undefined
	setKnowsWhenLastInteractionWas: React.Dispatch<
		React.SetStateAction<boolean | undefined>
	>
	setHasInputtedLastInteractionDate: React.Dispatch<
		React.SetStateAction<boolean>
	>
}
const LastInteractionInputs: React.FC<LastInteractionInputsProps> = ({
	friendName,
	knowsWhenLastInteractionWas,
	setKnowsWhenLastInteractionWas,
	setHasInputtedLastInteractionDate,
}) => {
	function handleSelectedRadio() {
		setHasInputtedLastInteractionDate(true)
	}

	return (
		<fieldset>
			<legend>Last interaction</legend>

			<div className="radio_and_label">
				<span className="question">
					Do you remember the last time you directly interacted with
					this person?
				</span>
				<input
					type="radio"
					name="remembers_last_interaction"
					id="remembersLastInteraction_yes"
					value="yes"
					onChange={() => {
						setKnowsWhenLastInteractionWas(true)
					}}
				/>
				<label htmlFor="remembersLastInteraction_yes">Yes</label>
			</div>

			<div className="radio_and_label">
				<input
					type="radio"
					name="remembers_last_interaction"
					id="remembersLastInteraction_no"
					value="no"
					onChange={() => {
						setKnowsWhenLastInteractionWas(false)
					}}
				/>
				<label htmlFor="remembersLastInteraction_no">No</label>
			</div>
			<div className="last_interaction_date">
				{knowsWhenLastInteractionWas === true && (
					<div className="absolute">
						<label htmlFor="lastInteractionDate">
							Date of last interaction:
						</label>
						<input
							type="date"
							id="lastInteractionDate"
							name="last_interaction_date"
							onChange={() => {
								setHasInputtedLastInteractionDate(true)
							}}
						/>
					</div>
				)}

				{knowsWhenLastInteractionWas === false && (
					<div className="approximate">
						<label htmlFor="lastInteractionDate">
							Have you interacted with {friendName} in...
						</label>
						<input
							type="radio"
							id="lastInteractionDate_1_week"
							name="last_interaction_date"
							value="1_week_ago"
							onChange={handleSelectedRadio}
						/>
						<label htmlFor="lastInteractionDate_1_week">
							The past week
						</label>

						<input
							type="radio"
							id="lastInteractionDate_2_weeks"
							name="last_interaction_date"
							value="2_week_ago"
							onChange={handleSelectedRadio}
						/>
						<label htmlFor="lastInteractionDate_2_weeks">
							The past 2 weeks
						</label>

						<input
							type="radio"
							id="lastInteractionDate_2_months"
							name="last_interaction_date"
							value="2_month_ago"
							onChange={handleSelectedRadio}
						/>
						<label htmlFor="lastInteractionDate_2_months">
							The past 2 months
						</label>

						<input
							type="radio"
							id="lastInteractionDate_6_months"
							name="last_interaction_date"
							value="6_month_ago"
							onChange={handleSelectedRadio}
						/>
						<label htmlFor="lastInteractionDate_2_months">
							The past 6 months
						</label>

						<input
							type="radio"
							id="lastInteractionDate_7plus_months"
							name="last_interaction_date"
							value="7plus_month_ago"
							onChange={handleSelectedRadio}
						/>
						<label htmlFor="lastInteractionDate_7plus_months">
							Sometime longer ago than 6 months
						</label>

						<input
							type="radio"
							id="lastInteractionDate_idk"
							name="last_interaction_date"
							value="idk"
							onChange={handleSelectedRadio}
						/>
						<label htmlFor="lastInteractionDate_idk">
							I have no idea when I last interacted with{" "}
							{friendName}
						</label>
					</div>
				)}
			</div>
		</fieldset>
	)
}

const AddFriends: React.FC = () => {
	const [friendName, setFriendName] = useState<string>("")
	const [knowsWhenLastInteractionWas, setKnowsWhenLastInteractionWas] =
		useState<boolean | undefined>(undefined)
	const [hasInputtedLastInteractionDate, setHasInputtedLastInteractionDate] =
		useState<boolean>(false)
	const [hasInputtedRelationshipTier, setHasInputtedRelationshipTier] =
		useState<boolean>(false)

	useEffect(() => {
		console.log(
			// `hasInputtedName: ${hasInputtedName}\n`,
			`knowsWhenLastInteractionWas: ${knowsWhenLastInteractionWas}`,
		)
	}, [knowsWhenLastInteractionWas])

	return (
		<>
			<div id="addFriendsContent">
				<h2>Add a friend</h2>
				<form action="/friends" method="POST">
					<div className="formField">
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
								knowsWhenLastInteractionWas={
									knowsWhenLastInteractionWas
								}
								setKnowsWhenLastInteractionWas={
									setKnowsWhenLastInteractionWas
								}
								setHasInputtedLastInteractionDate={
									setHasInputtedLastInteractionDate
								}
							/>

							{hasInputtedLastInteractionDate && (
								<>
									<RelationshipSection
										hasInputtedRelationshipTier={
											hasInputtedRelationshipTier
										}
										setHasInputtedRelationshipTier={
											setHasInputtedRelationshipTier
										}
									/>

									{hasInputtedRelationshipTier && (
										<Optional />
									)}
								</>
							)}
						</>
					)}

					<input type="submit" value="Add friend" />
				</form>
			</div>
		</>
	)
}

export default AddFriends
