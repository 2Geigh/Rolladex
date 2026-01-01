import { Navigate, Outlet } from "react-router-dom"
import { GetSessionData, type LoginSessionData } from "../../contexts/auth"
import { useLayoutEffect } from "react"
import Loading from "../Loading/Loading"

type ProtectedRoutesProps = {
	loginSessionData: LoginSessionData
	setLoginSessionData: React.Dispatch<React.SetStateAction<LoginSessionData>>
	isLoading: boolean
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
	loginSessionData,
	setLoginSessionData,
	isLoading,
	setIsLoading,
}) => {
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
	}, []) // This empty dependancy array makes it so that it only runs the useLayoutEffect once at mount, rather than on every render

	if (isLoading) {
		return <Loading />
	}

	if (!loginSessionData.isLoggedIn) {
		return <Navigate to="/login" />
	}

	return <Outlet />
}

export default ProtectedRoutes
