import React, { useState } from 'react'
import { MAX_NAME_LENGTH } from '../../types/models/Friend'
import './styles/AddFriends.scss'
import { backend_base_url } from '../../util/url'
import { useNavigate } from 'react-router-dom'
import OptionalSection from './components/OptionalSection'
import LastInteractionInputs from './components/LastInteractionInputs'
import RelationshipSection from './components/RelationshipSection'

type RequiredFormData = {
	name: string | undefined
	last_interaction_date: string | null | undefined
	relationship_tier_code: number | null | undefined
}

type OptionalFormData = {
	birthday_month: number | undefined
	birthday_day: number | undefined
}

export type FormData = RequiredFormData & OptionalFormData

const AddFriends: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		name: undefined,
		last_interaction_date: undefined,
		relationship_tier_code: undefined,
		birthday_month: undefined,
		birthday_day: undefined,
	})
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

	const navigate = useNavigate()

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		if (!formData.name) {
			alert('Please fill out the name field')
			return
		} else if (!formData.last_interaction_date) {
			alert('Please properly fill out the last interaction date')
			return
		} else if (!formData.relationship_tier_code) {
			alert('Please specify the relationship type')
			return
		}

		try {
			const response = await fetch(`${backend_base_url}/friends`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(formData),
			})

			if (response.ok) {
				navigate('/friends')
			} else {
				alert(`Error: ${response.text}`)
			}
		} catch (err) {
			throw new Error(String(err))
		}
	}

	return (
		<>
			<div id='addFriendsContent'>
				<h2>Add a friend</h2>
				<form action='' onSubmit={handleSubmit}>
					<div id='nameFormField'>
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							name='name'
							required
							maxLength={MAX_NAME_LENGTH}
							tabIndex={0}
							onChange={(e) => {
								const inputtedText = e.target.value

								setFormData({
									...formData,
									name: inputtedText,
								})
							}}
						/>
					</div>

					{formData.name !== undefined && (
						<>
							<LastInteractionInputs
								formData={formData}
								setFormData={setFormData}
								friendName={formData.name}
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

							{formData.last_interaction_date !== undefined && (
								<>
									<RelationshipSection
										formData={formData}
										setFormData={setFormData}
										friendName={formData.name}
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

									{formData.relationship_tier_code !==
										undefined && (
										<>
											<OptionalSection
												formData={formData}
												setFormData={setFormData}
												friendName={formData.name}
											/>
											<input
												tabIndex={0}
												type='submit'
												id='Submit'
												value='Add friend'
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
