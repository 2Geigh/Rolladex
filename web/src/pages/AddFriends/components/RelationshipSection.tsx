import type { FormData } from '../AddFriends'
import { useState } from 'react'
import RelationshipTierDescription from './RelationshipTierDescription'
import RelationshipTierSelectOptions from './RelationshipTierSelect'

type RelationshipSectionProps = {
	formData: FormData
	setFormData: React.Dispatch<React.SetStateAction<FormData>>
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
	formData,
	setFormData,
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
		<div className='section' id='relationshipTier'>
			<div
				className='fieldset_content'
				onMouseLeave={() => {
					setLastHoveredRelationshipTier(
						currentlySelectedRelationshipTier
					)
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
						relationship_tier_code={lastHoveredRelationshipTier}
					/>
					<RelationshipTierSelectOptions
						formData={formData}
						setFormData={setFormData}
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

export default RelationshipSection
