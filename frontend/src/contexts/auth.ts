import { backend_base_url } from "../util/url"

export async function IsLoginSessionValid(): Promise<boolean> {
	/*
		Returns true if session is valid according
		to the server, false otherwise.
	*/

	const redirectMessage_serverside = `Session could not be validated on the server`
	const permittedMessage_serverside = `Login session validated on the server.`

	try {
		console.log("Sending cookie data to server...")
		const response = await fetch(`${backend_base_url}/session/valid`, {
			method: "GET",
			credentials: "include", // sends cookies
		})

		if (response.ok) {
			console.log(permittedMessage_serverside)
			return true
		}

		if (response.status === 401) {
			console.log(redirectMessage_serverside)
			return false
		}
	} catch (err) {
		throw new Error(`user isn't logged in: ${err}`)
	}

	return false
}
