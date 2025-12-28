import { backend_base_url } from "./url"

function isCookieExpired(cookieName: string): boolean {
	const cookies = document.cookie.split("; ")
	for (let cookie of cookies) {
		const [name, value] = cookie.split("=")
		if (name === cookieName) {
			const cookieValuePair = value.split(";")
			let expirationDate: Date | null = null

			// Loop through possible attributes
			for (let attribute of cookieValuePair) {
				// Check for expiration attribute
				if (attribute.trim().startsWith("expires=")) {
					const expires = attribute.split("=")[1]
					expirationDate = new Date(expires)
					break
				}
			}

			if (!expirationDate) {
				// No expiration date found, cookie is considered invalid
				return true
			}

			// Compare expiration date with current date
			if (expirationDate < new Date()) {
				return true
			} else {
				return false
			}
		}
	}

	return true
}

async function validateSession(): Promise<boolean> {
	/*
		Returns true if session is valid, false otherwise
	*/

	const sessionCookieName = "myFriends_session_token"
	const sessionCookieExists = document.cookie.includes(
		`${sessionCookieName}=`,
	)

	if (!sessionCookieExists) {
		return false
	}

	if (isCookieExpired(sessionCookieName)) {
		return false
	}

	try {
		const response = await fetch(`${backend_base_url}/session/valid`, {
			method: "GET",
			credentials: "include", // sends cookies
		})

		if (response.ok) {
			return true
		}

		if (response.status === 401) {
			return false
		}
	} catch (err) {
		throw new Error(`user isn't logged in: ${err}`)
	}

	return false
}

export function RedirectIfSessionInvalid( // Runs within a useLayoutEffect hook before component renders
	isSessionValid: boolean,
	setIsSessionValid: React.Dispatch<React.SetStateAction<boolean>>, // must be false by default
	setRedirectToLogin: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const redirectMessage = `Not logged in. Redirecting to login page...`

	if (!isSessionValid) {
		// according to clientside state
		console.log(redirectMessage)
		setRedirectToLogin(true)
	} else {
		validateSession().then((isValid) => {
			if (!isValid) {
				// according to database
				console.log(redirectMessage)
				setRedirectToLogin(true)
				setIsSessionValid(false)
			}
		})
	}
}

export type SessionProps = {
	isSessionValid: boolean
	setIsSessionValid: React.Dispatch<React.SetStateAction<boolean>>
}
