import './styles/Footer.scss'

const Footer = () => {
	const today = new Date()
	const thisYear = today.getFullYear()

	let copyrightYears
	if (thisYear <= 2025) {
		copyrightYears = `2025`
	} else {
		copyrightYears = `2025-${thisYear}`
	}

	return (
		<>
			<nav className='footer'>
				<span className='copyrightStatement'>
					<a
						href='https://nicholasgarcia.com'
						target='blank_'
						className='logo'
					>
						Nicholas Garcia
					</a>
					, <span className='year'>{String(copyrightYears)}</span>.
				</span>
			</nav>
		</>
	)
}

export default Footer
