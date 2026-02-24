import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Link } from 'react-router-dom'
import { useLoginSessionContext } from '../../contexts/LoginSession'
import './PageNotFound.scss'

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
			<div id='NotFoundContent'>
				<div className='top'>
					<h2 id='error-code'>404</h2>
					<img
						alt='₍˄·͈༝·͈˄₍˄·͈༝·͈˄( ͒ ु•·̫• ू ͒)˄·͈༝·͈˄₎˄·͈༝·͈˄₎'
						id='cuteness'
						draggable='false'
					/>
				</div>
				<Link to={'/home'} id='go-home'>
					Go home
				</Link>
			</div>
		</>
	)
}

export default PageNotFoundWithoutHeaderAndFooter
export { PageNotFoundWithHeaderAndFooter }
