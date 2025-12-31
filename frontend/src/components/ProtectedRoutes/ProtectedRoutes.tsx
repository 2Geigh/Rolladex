import { Navigate, Outlet } from "react-router-dom"
import { IsLoginSessionValid } from "../../contexts/auth"
import { useLayoutEffect } from "react"
import Loading from "../Loading/Loading"

type ProtectedRoutesProps = {
	isLoggedIn: boolean
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
	isLoading: boolean
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
	isLoggedIn,
	setIsLoggedIn,
	isLoading,
	setIsLoading,
}) => {
	// Auth guard
	useLayoutEffect(() => {
		if (isLoading) {
			setIsLoading(true)
		}

		IsLoginSessionValid()
			.then((isValid) => {
				setIsLoggedIn(isValid)
			})
			.finally(() => {
				setIsLoading(false)
			})
	})

	if (isLoading) {
		return <Loading />
	}

	if (isLoggedIn) {
		return <Outlet />
	}

	return <Navigate to="/login" />
}

export default ProtectedRoutes
