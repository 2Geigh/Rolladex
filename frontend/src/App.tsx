import { Routes, Route } from "react-router-dom"
import Login from "./components/Login/Login"
import SignUp from "./components/Signup/Signup"
import Home from "./components/Home/Home"
import Friends from "./components/Friends/Friends"
import FriendStandalonePage from "./components/Friends/FriendStandalonePage"
import Profile from "./components/Profile/Profile"
import Logout from "./components/Logout/Logout"
import { useState } from "react"
import {
	GetSessionAndUserData,
	LoginSessionContext,
} from "./contexts/LoginSession"
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes"
import Settings from "./components/Settings/Settings"
import type { LoginSessionData } from "./contexts/LoginSession"
import { useLayoutEffect } from "react"
import Loading from "./components/Loading/Loading"
import Navbar from "./components/Navbar/Navbar"
import AddFriends from "./components/AddFriends/AddFriends"
import Footer from "./components/Footer/Footer"
import "../static/styles/app.css"
import PageNotFoundWithoutHeaderAndFooter from "./components/PageNotFound/PageNotFoundWithoutHeaderAndFooter"
import InteractionStandalonePage from "./components/Interactions/InteractionStandalonePage"

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
