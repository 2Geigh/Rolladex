import { Navigate } from "react-router-dom"
import { useLayoutEffect, useState } from "react"
import Loading from "../Loading/Loading"
import { backend_base_url } from "../../util/url"
import { useLoginSessionContext } from "../../contexts/LoginSession"

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
	const loginSessionContext = useLoginSessionContext()
	const [isLoading, setIsLoading] = useState(true)

	useLayoutEffect(() => {
		HasLoggedOut()
			.then((hasLoggedOut) => {
				loginSessionContext.updateSession({
					...loginSessionContext,
					isLoggedIn: !hasLoggedOut,
				})
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

	return <Navigate to="/login" />
}

export default Logout
