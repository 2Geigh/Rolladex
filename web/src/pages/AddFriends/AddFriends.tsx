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

export type AddFriendsInputState = {
	knowsApproximateLastInteraction: boolean | undefined
	knowsAbsoluteLastInteraction: boolean | undefined
	hasInputtedLastInteractionDate: boolean
	hasInputtedRelationshipTier: boolean
	currentlySelectedRelationshipTier: number | undefined
	lastHoveredRelationshipTier: number | undefined
}

const AddFriends: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		name: undefined,
		last_interaction_date: undefined,
		relationship_tier_code: undefined,
		birthday_month: undefined,
		birthday_day: undefined,
	})

	const [input, setInput] = useState<AddFriendsInputState>({
		knowsApproximateLastInteraction: undefined,
		knowsAbsoluteLastInteraction: undefined,
		hasInputtedLastInteractionDate: false,
		hasInputtedRelationshipTier: false,
		currentlySelectedRelationshipTier: undefined,
		lastHoveredRelationshipTier: undefined,
	})

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
								input={input}
								setInput={setInput}
							/>

							{formData.last_interaction_date !== undefined && (
								<>
									<RelationshipSection
										formData={formData}
										setFormData={setFormData}
										friendName={formData.name}
										input={input}
										setInput={setInput}
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
