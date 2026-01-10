import { useLoginSessionContext } from "../../contexts/LoginSession"
import { Navigate, Outlet } from "react-router-dom"
import Loading from "../Loading/Loading"
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

const ProtectedRoutes: React.FC = () => {
	const loginSessionContext = useLoginSessionContext()

	if (loginSessionContext.isLoggedIn === undefined) {
		// accounts for the initial <App/> load
		return <Loading />
	}

	if (!loginSessionContext.isLoggedIn) {
		return <Navigate to="/login" />
	}

	return (
		<>
			<Navbar username={String(loginSessionContext.user?.username)} />
			<Outlet />
			<Footer />
		</>
	)
}

export default ProtectedRoutes
