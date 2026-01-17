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
			<div className="content">
				<div className="top">
					<h2 id="error-code">404</h2>
					<img
						src="../../../static/images/404/webp/cat1_100px.webp"
						srcSet="../../../static/images/404/webp/cat2_100px.webp 100w,
                                ../../../static/images/404/webp/cat2_200px.webp 200w,
                                ../../../static/images/404/webp/cat2_300px.webp 300w,
                                ../../../static/images/404/webp/cat2_400px.webp 400w,
                                ../../../static/images/404/webp/cat2_500px.webp 500w,
                                ../../../static/images/404/webp/cat2_600px.webp 600w,
                                ../../../static/images/404/webp/cat2_1000px.webp, 1000w"
						sizes=" (width <= 200px) 100px,
                                    (width <= 300px) 200px,
                                    (width <= 400px) 300px,
                                    (width <= 500px) 400px,
                                    (width <= 600px) 500px,
                                    (width <= 700px) 600px,
                                    600px,"
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
