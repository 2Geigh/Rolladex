import type { FormData } from '../AddFriends'
import { DefaultRelationshipTiers } from '../../../types/models/Friend'

type RelationshipTierSelectOptionsProps = {
	formData: FormData
	setFormData: React.Dispatch<React.SetStateAction<FormData>>
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
	formData,
	setFormData,
	hasInputtedRelationshipTier,
	setHasInputtedRelationshipTier,
	currentlySelectedRelationshipTier,
	setCurrentlySelectedRelationshipTier,
	setLastHoveredRelationshipTier,
}: RelationshipTierSelectOptionsProps) => {
	const options = Object.values(DefaultRelationshipTiers).map(
		(relationship_tier) => {
			const name = 'relationship_tier'
			const inputValue = relationship_tier.code
			const inputId = relationship_tier.name.replace(/\s+/g, '')
			const labelFor = inputId
			const labelInnerHtml = `${relationship_tier.emoji} ${relationship_tier.name}`

			return (
				<div key={inputValue} className='relationshipLabelAndRadio'>
					<input
						name={name}
						required
						type='radio'
						value={relationship_tier.code}
						id={inputId}
						onChange={() => {
							if (!hasInputtedRelationshipTier) {
								setHasInputtedRelationshipTier(true)
								setFormData({
									...formData,
									relationship_tier_code: null,
								})
							}

							if (relationship_tier.code !== undefined) {
								setCurrentlySelectedRelationshipTier(
									relationship_tier.code
								)
								setFormData({
									...formData,
									relationship_tier_code:
										relationship_tier.code,
								})
							} else {
								setFormData({
									...formData,
									relationship_tier_code: null,
								})
							}
						}}
					/>

					<label
						tabIndex={0}
						htmlFor={labelFor}
						onMouseEnter={() => {
							setLastHoveredRelationshipTier(
								relationship_tier.code
							)
						}}
						onClick={() => {
							setLastHoveredRelationshipTier(
								relationship_tier.code
							)
						}}
						onKeyDown={(e) =>
							e.key === 'Enter' ?
								setLastHoveredRelationshipTier(
									relationship_tier.code
								)
							:	<></>
						}
						className={
							(
								currentlySelectedRelationshipTier !==
									undefined &&
								currentlySelectedRelationshipTier ===
									relationship_tier.code
							) ?
								'selected'
							:	''
						}
					>
						{labelInnerHtml}
					</label>
				</div>
			)
		}
	)

	return <div className='options'>{options}</div>
}

export default RelationshipTierSelectOptions
