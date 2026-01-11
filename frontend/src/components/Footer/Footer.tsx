import "./styles/dist/Footer.min.css"

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
			<nav className="footer">
				<span className="copyrightStatement">
					Developed with love by{" "}
					<a
						href="https://www.github.com/2geigh"
						target="blank_"
						className="logo"
					>
						Nicholas Garcia
					</a>
					, {String(copyrightYears)}.
				</span>
			</nav>
		</>
	)
}

export default Footer
