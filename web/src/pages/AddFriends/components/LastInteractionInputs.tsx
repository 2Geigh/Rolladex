import type { FormData } from '../AddFriends'

type LastInteractionInputsProps = {
	formData: FormData
	setFormData: React.Dispatch<React.SetStateAction<FormData>>
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
	formData,
	setFormData,
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
			'time_unit_multiple'
		) as HTMLInputElement
		inputtedTimeAgoMultipleElement.value = ''

		const inputtedTimeAgoUnitElement = document.getElementById(
			'time_unit'
		) as HTMLSelectElement
		inputtedTimeAgoUnitElement.value = ''

		if (
			e.target.value.trim() !== '' ||
			e.target.value !== null ||
			e.target.value !== undefined
		) {
			const date = new Date(e.target.value).toISOString()

			setHasInputtedLastInteractionDate(true)
			setFormData({
				...formData,
				last_interaction_date: date,
			})
		} else {
			setHasInputtedLastInteractionDate(false)
			setFormData({ ...formData, last_interaction_date: null })
		}
	}

	function onChangeApproximateDate() {
		setKnowsAbsoluteLastInteraction(false)
		setKnowsApproximateLastInteraction(true)

		const inputtedTimeAgoMultipleElement = document.getElementById(
			'time_unit_multiple'
		) as HTMLInputElement

		const inputtedTimeAgoUnitElement = document.getElementById(
			'time_unit'
		) as HTMLSelectElement

		const inputtedAbsoluteLastInteractionDate = document.getElementById(
			'last_interaction_date_absolute'
		) as HTMLInputElement

		function calculatePastDate(n: number, unit: string): string {
			const localDate = new Date()

			switch (unit.toLowerCase()) {
				case 'years':
				case 'year':
					localDate.setFullYear(localDate.getFullYear() - n)
					break
				case 'months':
				case 'month':
					localDate.setMonth(localDate.getMonth() - n)
					break
				case 'weeks':
				case 'week':
					localDate.setDate(localDate.getDate() - n * 7)
					break
				case 'days':
				case 'day':
					localDate.setDate(localDate.getDate() - n)
					break
				case 'hours':
				case 'hour':
					localDate.setHours(localDate.getHours() - n)
					break
				default:
					throw new Error(
						'Invalid unit of time. Use "years", "months", "weeks", "days", or "hours".'
					)
			}

			return localDate.toISOString()
		}

		if (
			inputtedTimeAgoMultipleElement.value.trim() !== '' &&
			inputtedTimeAgoUnitElement.value.trim() !== ''
		) {
			inputtedAbsoluteLastInteractionDate.value = ''
			setHasInputtedLastInteractionDate(true)

			const timeUnit = inputtedTimeAgoUnitElement.value.trim()
			const numberOf = parseInt(
				inputtedTimeAgoMultipleElement.value.trim()
			)
			const pastDate = calculatePastDate(numberOf, timeUnit)
			setFormData({ ...formData, last_interaction_date: pastDate })
		} else {
			setHasInputtedLastInteractionDate(false)
			setFormData({ ...formData, last_interaction_date: null })
		}
	}

	return (
		<div className='section' id='lastInteraction'>
			<span className='question'>
				When did you last meaningfully interact with {friendName}?
			</span>
			<div className='answerContent'>
				<div
					className={
						knowsApproximateLastInteraction ? 'absolute ignored' : (
							'absolute'
						)
					}
				>
					<label htmlFor='last_interaction_date_absolute'>
						Last interaction date
					</label>
					<input
						tabIndex={0}
						type='date'
						id='last_interaction_date_absolute'
						onChange={onChangeAbsoluteDate}
						min='1900-01-01'
						max={new Date().toISOString().split('T')[0]}
					/>
				</div>
				<span className='or'>or</span>
				<div
					className={
						knowsAbsoluteLastInteraction ?
							'approximate ignored'
						:	'approximate'
					}
				>
					<span className='inputtedTimeAgo'>
						〜{' '}
						<input
							tabIndex={0}
							name='time_unit_multiple'
							id='time_unit_multiple'
							type='number'
							min={0}
							max={99}
							onChange={onChangeApproximateDate}
						/>{' '}
						<select
							name='time_unit'
							id='time_unit'
							defaultValue=''
							onChange={onChangeApproximateDate}
						>
							<option value='' disabled>
								Units
							</option>
							<option value='hours'>Hours</option>
							<option value='days'>Days</option>
							<option value='weeks'>Weeks</option>
							<option value='months'>Months</option>
							<option value='years'>Years</option>
						</select>{' '}
						ago
					</span>
				</div>
			</div>
		</div>
	)
}

export default LastInteractionInputs
