import { useLoginSessionContext } from "../../contexts/LoginSession"
import { Navigate, Outlet } from "react-router-dom"
import Loading from "../Loading/Loading"

const ProtectedRoutes: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()

	if (loginSessionContext.isLoggedIn === undefined) {
		// accounts for the initial <App/> load
		return <Loading />
	}

	if (!loginSessionContext.isLoggedIn) {
		return <Navigate to="/login" />
	}

	return <Outlet />
}

export default ProtectedRoutes
