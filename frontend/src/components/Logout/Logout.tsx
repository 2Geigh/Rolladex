import { Navigate } from "react-router-dom"
import { useLayoutEffect, useState } from "react"
import Loading from "../Loading/Loading"
import { backend_base_url } from "../../util/url"

async function HasLoggedOut(): Promise<boolean> {
	const response = await fetch(`${backend_base_url}/logout`, {
		method: "GET",
		credentials: "include",
	}).catch((err) => {
		throw new Error(err)
	})

	if (!response.ok) {
		console.error(
			`(${response.status}) ${response.statusText} (): ${await response.text()}`,
		)
		return false
	}

	console.log("Logged out")
	return true
}

const Logout: React.FC = () => {
	const [hasLoggedOut, setHasLoggedOut] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useLayoutEffect(() => {
		HasLoggedOut()
			.then((hasLoggedOut) => {
				setHasLoggedOut(hasLoggedOut)
			})
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

	if (!hasLoggedOut) {
		return <Navigate to="/login" />
	}

	return <Navigate to="/login" />
}

export default Logout
