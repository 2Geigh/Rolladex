import { useState } from 'react'
import { GetMaxDaysInMonth, GetZodiac } from '../../../util/dates'
import { type FormData } from '../AddFriends'

type OptionalSectionProps = {
	formData: FormData
	setFormData: React.Dispatch<React.SetStateAction<FormData>>
	friendName: string
}

const OptionalSection: React.FC<OptionalSectionProps> = ({
	formData,
	setFormData,
	friendName,
}) => {
	const [month, setMonth] = useState<string | null>(null)
	const [day, setDay] = useState<string | null>(null)

	const maxDays = GetMaxDaysInMonth(month)

	return (
		<div id='optional'>
			<legend>Optional</legend>

			<div id='birthday' className='section'>
				<label htmlFor='birthday'>{friendName}'s birthday: </label>

				<div className='formField'>
					<select
						name='birthday_month'
						id='birthdayMonth'
						onChange={(e) => {
							setMonth(e.target.value)

							if (e.target.value.trim() !== '') {
								setFormData({
									...formData,
									birthday_month: parseInt(e.target.value),
								})
							}
						}}
						defaultValue={'00'}
					>
						<option id='defaultMonth' disabled selected value='00'>
							Month
						</option>
						<option value='01'>January</option>
						<option value='02'>February</option>
						<option value='03'>March</option>
						<option value='04'>April</option>
						<option value='05'>May</option>
						<option value='06'>June</option>
						<option value='07'>July</option>
						<option value='08'>August</option>
						<option value='09'>September</option>
						<option value='10'>October</option>
						<option value='11'>November</option>
						<option value='12'>December</option>
					</select>
					<select
						name='birthday_day'
						id='birthdayDay'
						onChange={(e) => {
							setDay(e.target.value)

							if (e.target.value.trim() !== '') {
								setFormData({
									...formData,
									birthday_day: parseInt(e.target.value),
								})
							}
						}}
					>
						<option id='defaultDay' disabled selected value='00'>
							Day
						</option>
						{Array.from({ length: maxDays }, (_, index) => (
							<option
								key={index + 1}
								value={String(index + 1).padStart(2, '0')}
							>
								{index + 1}
							</option>
						))}
					</select>
					<div
						id='zodiacEmoji'
						title={GetZodiac(month, day).zodiacName}
					>
						{GetZodiac(month, day).zodiacEmoji}
					</div>
				</div>
			</div>
		</div>
	)
}

export default OptionalSection
