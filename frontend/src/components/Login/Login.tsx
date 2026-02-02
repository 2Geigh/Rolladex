import "./Login.scss"
import { Navigate } from "react-router-dom"
import type { FormEvent } from "react"
import { useLayoutEffect, useState } from "react"
import {
	GetSessionAndUserData,
	useLoginSessionContext,
} from "../../contexts/LoginSession"
import Loading from "../Loading/Loading"

type loginData = {
	username: string
	password: string
}

const Login: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()
	const [isLoading, setIsLoading] = useState(true)

	// Auth guard
	useLayoutEffect(() => {
		setIsLoading(false)
	}, [])

	if (isLoading) {
		return <Loading />
	}

	if (loginSessionContext.isLoggedIn) {
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
			loginSessionContext.updateSession({
				...loginSessionContext,
				isLoggedIn: true,
			})
			await GetSessionAndUserData(
				loginSessionContext,
				loginSessionContext.updateSession,
			)
		} else {
			const errorText = await response.text()
			alert(errorText)
		}
	}

	return (
		<>
			<div id="loginContainer">
				<div id="loginContent">
					<h1>Rolladex</h1>
					<form id="loginForm" onSubmit={handleSubmit}>
						<label htmlFor="username">
							Username{" "}
							<input required name="username" type="text"></input>
						</label>

						<label htmlFor="password">
							Password{" "}
							<input
								required
								name="password"
								type="password"
							></input>
						</label>

						<input
							id="loginButton"
							type="submit"
							value="Login"
						></input>
					</form>

					<span id="toSignup">
						Don't have an account?{" "}
						<a href="/signup">Register now!</a>
					</span>
				</div>
			</div>
		</>
	)
}

export default Login
