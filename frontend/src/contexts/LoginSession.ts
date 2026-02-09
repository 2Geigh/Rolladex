import { createContext, useContext } from "react"
import { backend_base_url } from "../util/url"
import type { User } from "../types/models/User"

export type LoginSessionData = {
	isLoggedIn: boolean
	user: User | undefined
}

export type LoginSessionContextType = LoginSessionData & {
	updateSession: React.Dispatch<React.SetStateAction<LoginSessionData>>
}

export const LoginSessionContext = createContext<
	LoginSessionContextType | undefined
>(undefined)

export function useLoginSessionContext() {
	const loginSessionContext = useContext(LoginSessionContext)

	if (loginSessionContext === undefined) {
		throw new Error("useLoginSessionContext must be used within provider")
	}
	return loginSessionContext
}

export async function GetSessionAndUserData(
	loginSessionData: LoginSessionData,
	setLoginSessionData: React.Dispatch<React.SetStateAction<LoginSessionData>>,
): Promise<void> {
	/*
		Returns true if session is valid according
		to the server, false otherwise.
	*/

	const redirectMessage_serverside = `Session could not be validated on the server`
	const permittedMessage_serverside = `Login session validated on the server.`

	const response = await fetch(`${backend_base_url}/session/valid`, {
		method: "GET",
		credentials: "include", // sends cookies
	})

	if (response.status === 401) {
		console.log(redirectMessage_serverside)
		setLoginSessionData({ ...loginSessionData, isLoggedIn: false })
		return
	}
	if (!response.ok) {
		setLoginSessionData({
			...loginSessionData,
			isLoggedIn: false,
			user: undefined,
		})
		throw new Error(`${redirectMessage_serverside}: ${response.statusText}`)
	} else {
		console.log(permittedMessage_serverside)
	}

	try {
		const parsed = await response.json()

		if (parsed && parsed.id && typeof parsed.username === "string") {
			const user: User = parsed as User
			setLoginSessionData({
				...loginSessionData,
				user: user,
				isLoggedIn: true,
			})
			return
		}
	} catch (err) {
		throw new Error(`Invalid user data from /session/user: ${err}`)
	}
}

export async function GetSessionData(
	loginSessionData: LoginSessionData,
	setLoginSessionData: React.Dispatch<React.SetStateAction<LoginSessionData>>,
): Promise<void> {
	/*
		Returns true if session is valid according
		to the server, false otherwise.
	*/

	const redirectMessage_serverside = `Session could not be validated on the server`
	const permittedMessage_serverside = `Login session validated on the server.`

	const response = await fetch(`${backend_base_url}/session/valid`, {
		method: "GET",
		credentials: "include", // sends cookies
	})

	if (response.status === 401) {
		console.log(redirectMessage_serverside)
		setLoginSessionData({ ...loginSessionData, isLoggedIn: false })
		return
	}
	if (!response.ok) {
		setLoginSessionData({
			...loginSessionData,
			isLoggedIn: false,
		})
		throw new Error(`${redirectMessage_serverside}: ${response.statusText}`)
	} else {
		console.log(permittedMessage_serverside)
		setLoginSessionData({
			...loginSessionData,
			isLoggedIn: true,
		})
		return
	}
}
