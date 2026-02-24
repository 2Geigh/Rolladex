import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Link } from 'react-router-dom'
import { useLoginSessionContext } from '../../contexts/LoginSession'
import './Error.scss'
import type { FC } from 'react'

type HttpErrorProps = {
	errorCode: number
	errorMessage: string
}

const HttpErrorWithHeaderAndFooter: FC<HttpErrorProps> = ({
	errorCode,
	errorMessage,
}) => {
	const loginSessionData = useLoginSessionContext()

	return (
		<>
			<Navbar
				isLoggedIn={loginSessionData.isLoggedIn}
				username={loginSessionData.user?.username}
			/>
			<HttpErrorWithoutHeaderAndFooter
				errorCode={errorCode}
				errorMessage={errorMessage}
			/>
			<Footer />
		</>
	)
}

const HttpErrorWithoutHeaderAndFooter: FC<HttpErrorProps> = ({
	errorCode,
	errorMessage,
}) => {
	return (
		<>
			<div id='ErrorContent'>
				<div className='top'>
					<h2 id='errorCode'>{errorCode}</h2>
					<h3 id='errorMessage'>{errorMessage}</h3>
					<img
						alt='₍˄·͈༝·͈˄₍˄·͈༝·͈˄( ͒ ु•·̫• ू ͒)˄·͈༝·͈˄₎˄·͈༝·͈˄₎'
						id='cuteness'
						draggable='false'
					/>
				</div>
				<Link to={'/home'} id='goHome'>
					Go home
				</Link>
			</div>
		</>
	)
}

export default HttpErrorWithoutHeaderAndFooter
export { HttpErrorWithHeaderAndFooter }
