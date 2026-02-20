import type { AddFriendsInputState, FormData } from '../AddFriends'
import { DefaultRelationshipTiers } from '../../../types/models/Friend'
import type React from 'react'

type RelationshipTierSelectOptionsProps = {
	formData: FormData
	setFormData: React.Dispatch<React.SetStateAction<FormData>>
	input: AddFriendsInputState
	setInput: React.Dispatch<React.SetStateAction<AddFriendsInputState>>
}

const RelationshipTierSelectOptions = ({
	formData,
	setFormData,
	input,
	setInput,
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
							if (!input.hasInputtedRelationshipTier) {
								setInput({
									...input,
									hasInputtedRelationshipTier: true,
								})
								setFormData({
									...formData,
									relationship_tier_code: null,
								})
							}

							if (relationship_tier.code !== undefined) {
								setInput({
									...input,
									currentlySelectedRelationshipTier:
										relationship_tier.code,
								})
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
							setInput({
								...input,
								lastHoveredRelationshipTier:
									relationship_tier.code,
							})
						}}
						onClick={() => {
							setInput({
								...input,
								lastHoveredRelationshipTier:
									relationship_tier.code,
							})
						}}
						onKeyDown={(e) =>
							e.key === 'Enter' ?
								setInput({
									...input,
									lastHoveredRelationshipTier:
										relationship_tier.code,
								})
							:	<></>
						}
						className={
							(
								input.currentlySelectedRelationshipTier !==
									undefined &&
								input.currentlySelectedRelationshipTier ===
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
