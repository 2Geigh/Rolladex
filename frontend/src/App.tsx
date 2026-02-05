import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import Logout from "./pages/Logout/Logout"
import { useState } from "react"
import {
	GetSessionAndUserData,
	LoginSessionContext,
} from "./contexts/LoginSession"
import Login from "./pages/Login/Login"
import SignUp from "./pages/Signup/Signup"
import Friends from "./pages/Friends/Friends"
import FriendStandalonePage from "./pages/Friends/FriendStandalonePage"
import Loading from "./components/Loading/Loading"
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes"
import InteractionStandalonePage from "./pages/Interactions/InteractionStandalonePage"
import Settings from "./pages/Settings/Settings"
import type { LoginSessionData } from "./contexts/LoginSession"
import AddFriends from "./pages/AddFriends/AddFriends"
import Profile from "./pages/Profile/Profile"
import { useLayoutEffect } from "react"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import "../static/styles/app.scss"
import PageNotFoundWithoutHeaderAndFooter from "./components/PageNotFound/PageNotFoundWithoutHeaderAndFooter"

function App() {
	const [loginSessionData, setLoginSessionData] = useState<LoginSessionData>({
		isLoggedIn: false,
		user: undefined,
	})
	const [isLoading, setIsLoading] = useState(true)
	const LoginSessionContextValue = {
		...loginSessionData,
		updateSession: setLoginSessionData,
	}

	useLayoutEffect(() => {
		setIsLoading(true)
		GetSessionAndUserData(loginSessionData, setLoginSessionData)
			.catch((err) => console.error(`session check failed: ${err}`))
			.finally(() => setIsLoading(false))
	}, []) // Runs only once on app mount

	if (isLoading) {
		return (
			<>
				<Navbar
					isLoggedIn={loginSessionData.isLoggedIn}
					username={loginSessionData.user?.username}
				/>
				<Loading />
			</>
		)
	}

	return (
		<>
			<LoginSessionContext.Provider value={LoginSessionContextValue}>
				<Navbar
					isLoggedIn={LoginSessionContextValue.isLoggedIn}
					username={LoginSessionContextValue.user?.username}
				/>
				<div id="bodyAndFooter">
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Logout />} />
						<Route path="/signup" element={<SignUp />} />

						<Route element={<ProtectedRoutes />}>
							<Route path="/" element={<Home />} />
							<Route path="/home" element={<Home />} />
							<Route path="/friends" element={<Friends />} />
							<Route
								path="/friends/:friendId"
								element={<FriendStandalonePage />}
							/>
							<Route
								path="/interactions/:interactionId"
								element={<InteractionStandalonePage />}
							/>
							<Route path="/addfriend" element={<AddFriends />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/settings" element={<Settings />} />
						</Route>

						<Route
							path="*"
							element={<PageNotFoundWithoutHeaderAndFooter />}
						></Route>
					</Routes>
					<Footer />
				</div>
			</LoginSessionContext.Provider>
		</>
	)
}

export default App
