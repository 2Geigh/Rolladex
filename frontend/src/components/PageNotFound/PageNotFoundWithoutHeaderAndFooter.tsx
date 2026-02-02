import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useLoginSessionContext } from "../../contexts/LoginSession"
import "./PageNotFound.css"

const PageNotFoundWithHeaderAndFooter = () => {
	const loginSessionData = useLoginSessionContext()

	return (
		<>
			<Navbar
				isLoggedIn={loginSessionData.isLoggedIn}
				username={loginSessionData.user?.username}
			/>
			<PageNotFoundWithoutHeaderAndFooter />
			<Footer />
		</>
	)
}

const PageNotFoundWithoutHeaderAndFooter: React.FC = () => {
	return (
		<>
			<div id="NotFoundContent">
				<div className="top">
					<h2 id="error-code">404</h2>
					<img
						alt="₍˄·͈༝·͈˄₍˄·͈༝·͈˄( ͒ ु•·̫• ू ͒)˄·͈༝·͈˄₎˄·͈༝·͈˄₎"
						id="cuteness"
					/>
				</div>
				<a href="/home" id="go-home">
					Go home
				</a>
			</div>
		</>
	)
}

export default PageNotFoundWithoutHeaderAndFooter
export { PageNotFoundWithHeaderAndFooter }
