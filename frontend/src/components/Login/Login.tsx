import Footer from "../Footer/Footer"
import NavbarWithoutLinks from "../Navbar/NavbarWithoutLinks"
import "./dist/Login.min.css"
import { Navigate, useNavigate } from "react-router-dom"
import type { FormEvent } from "react"
import { useLayoutEffect } from "react"
import { GetSessionData } from "../../contexts/auth"
import Loading from "../Loading/Loading"
import type { LoginSessionData } from "../../contexts/auth"

type loginData = {
	username: string
	password: string
}

type LoginProps = {
	isLoading: boolean
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
	loginSessionData: LoginSessionData
	setLoginSessionData: React.Dispatch<React.SetStateAction<LoginSessionData>>
}

const Login: React.FC<LoginProps> = ({
	isLoading,
	setIsLoading,
	loginSessionData,
	setLoginSessionData,
}) => {
	const navigate = useNavigate()

	// Auth guard
	useLayoutEffect(() => {
		if (!isLoading) {
			setIsLoading(true)
		}

		GetSessionData(loginSessionData, setLoginSessionData)
			.catch((err) => {
				throw new Error(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return <Loading />
	}
	if (loginSessionData.isLoggedIn) {
		return <Navigate to="/home" />
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget as HTMLFormElement)
		const data = Object.fromEntries(formData.entries())

		const loginData: loginData = {
			username: String(data.username),
			password: String(data.password),
		}

		const response = await fetch("http://localhost:3001/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // sends cookies
			body: JSON.stringify(loginData),
		})

		if (response.ok) {
			console.log("Credentials validated by server")
			setLoginSessionData({
				...loginSessionData,
				user: { username: loginData.username },
			})
			navigate("/home")
		} else {
			const errorText = await response.text()
			alert(errorText)
		}
	}

	return (
		<>
			<NavbarWithoutLinks />

			<div className="container">
				<form id="loginForm" onSubmit={handleSubmit}>
					<label htmlFor="username">
						Username{" "}
						<input required name="username" type="text"></input>
					</label>

					<label htmlFor="password">
						Password{" "}
						<input required name="password" type="password"></input>
					</label>

					<input id="loginButton" type="submit" value="Login"></input>
				</form>

				<span id="toSignup">
					Don't have an account? <a href="/signup">Register now!</a>
				</span>
			</div>

			<Footer />
		</>
	)
}

export default Login
