import Footer from "../Footer/Footer"
import NavbarWithoutLinks from "../Navbar/NavbarWithoutLinks"
import "./dist/Login.min.css"
import { Navigate, useNavigate } from "react-router-dom"
import type { FormEvent } from "react"
import { useLayoutEffect, useState } from "react"
import { IsLoginSessionValid } from "../../contexts/auth"
import Loading from "../Loading/Loading"
import type { User } from "../../types/models/User"

type loginData = {
	username: string
	password: string
}

type LoginProps = {
	setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
	const navigate = useNavigate()

	// Auth guard
	const [isLoginSessionValid, setIsLoginSessionValid] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	useLayoutEffect(() => {
		IsLoginSessionValid()
			.then((isValid) => {
				setIsLoginSessionValid(isValid)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])
	if (isLoading) {
		return <Loading />
	}
	if (isLoginSessionValid) {
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
			setUser({
				username: loginData.username,
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
