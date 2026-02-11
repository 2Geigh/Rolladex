import { useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import "./Signup.scss"
import { backend_base_url } from "../../util/url"

export type SignupData = {
	username: string
	password: string
}

const SignUp = () => {
	const [hasSignedUp, setHasSignedUp] = useState(false)

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const formData = new FormData(event.currentTarget as HTMLFormElement)
		const data = Object.fromEntries(formData.entries())

		const signupData: SignupData = {
			username: String(data.username),
			password: String(data.password),
		}

		const response = await fetch(`${backend_base_url}/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(signupData),
		})

		if (response.ok) {
			alert(`Registered ${signupData.username} as a user`)
			setHasSignedUp(true)
		} else {
			const errorText = await response.text()
			alert(errorText)
		}
	}

	if (hasSignedUp) {
		return <Navigate to="/login" />
	}

	return (
		<>
			<div id="signupContainer">
				<div id="signupContent">
					<h1>join Rolladex</h1>
					<form id="signupForm" onSubmit={handleSubmit}>
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

						<div id="agreements">
							<input
								required
								type="checkbox"
								id="tos-agree"
								name="tos-agree"
							></input>
							<label htmlFor="tos-agree">
								I have read and agree to the{" "}
								<a href="terms_of_service" target="_blank">
									terms of service
								</a>
							</label>
						</div>

						<input
							id="loginButton"
							type="submit"
							value="Sign Up"
						></input>
					</form>

					<span id="toLogin">
						Already have an account? <a href="/login">Login now!</a>
					</span>
				</div>
			</div>
		</>
	)
}

export default SignUp
