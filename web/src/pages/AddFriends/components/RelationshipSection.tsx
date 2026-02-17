import type { AddFriendsInputState, FormData } from '../AddFriends'
import React, { useState } from 'react'
import RelationshipTierDescription from './RelationshipTierDescription'
import RelationshipTierSelectOptions from './RelationshipTierSelect'

type RelationshipSectionProps = {
	formData: FormData
	setFormData: React.Dispatch<React.SetStateAction<FormData>>
	friendName: string
	input: AddFriendsInputState
	setInput: React.Dispatch<React.SetStateAction<AddFriendsInputState>>
}

const RelationshipSection: React.FC<RelationshipSectionProps> = ({
	formData,
	setFormData,
	friendName,
	input,
	setInput,
}) => {
	const [wantsToKnowWhy, setWantsToKnowWhy] = useState<boolean>(false)

	return (
		<div className='section' id='relationshipTier'>
			<div
				className='fieldset_content'
				onMouseLeave={() => {
					setInput({
						...input,
						lastHoveredRelationshipTier:
							input.currentlySelectedRelationshipTier,
					})
				}}
			>
				<label className='selectionPrompt'>
					Please select the level of friendship you want to maintain
					with {friendName}&nbsp;
					<span
						className='why'
						tabIndex={0}
						onClick={() => {
							setWantsToKnowWhy(!wantsToKnowWhy)
						}}
						onKeyDown={(e) =>
							e.key === 'Enter' ?
								setWantsToKnowWhy(!wantsToKnowWhy)
							:	<></>
						}
					>
						(why?)
					</span>
				</label>
				{wantsToKnowWhy ?
					<div id='algorithmExplanation'>
						<p>
							This app's algorithm heavily depends on the type of
							relationship you declare for each friend you add.
							<br />
							<br />
							For example, you'd be recommended to keep in contact
							with a 'close friend' more frequently than an
							'acquaintance' as the former generally requires
							higher maintenance.
						</p>
						<span
							className='close'
							tabIndex={0}
							onClick={() => {
								setWantsToKnowWhy(!wantsToKnowWhy)
							}}
							onKeyDown={(e) =>
								e.key === 'Enter' ?
									setWantsToKnowWhy(!wantsToKnowWhy)
								:	<></>
							}
						>
							Close
						</span>
					</div>
				:	<></>}
				<div className='tiersAndInfo'>
					<RelationshipTierDescription
						relationship_tier_code={
							input.lastHoveredRelationshipTier
						}
					/>
					<RelationshipTierSelectOptions
						formData={formData}
						setFormData={setFormData}
						input={input}
						setInput={setInput}
					/>
				</div>
			</div>
		</div>
	)
}

export default RelationshipSection
