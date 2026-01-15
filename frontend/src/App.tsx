import { Routes, Route } from "react-router-dom"
import Login from "./components/Login/Login"
import SignUp from "./components/Signup/Signup"
import Home from "./components/Home/Home"
import Friends from "./components/Friends/Friends"
import FriendStandalonePage from "./components/Friends/FriendStandalonePage"
import Profile from "./components/Profile/Profile"
import PageNotFound from "./components/PageNotFound/PageNotFound"
import Logout from "./components/Logout/Logout"
import { useState } from "react"
import { LoginSessionContext } from "./contexts/LoginSession"
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes"
import Meetups from "./components/Meetups/Meetups"
import MeetupStandalonePage from "./components/Meetups/MeetupStandalonePage"
import Settings from "./components/Settings/Settings"
import "../static/styles/AddFriends.css"
import type { LoginSessionData } from "./contexts/LoginSession"
import { useEffect } from "react"
import { GetSessionData } from "./contexts/LoginSession"
import Loading from "./components/Loading/Loading"
import Navbar from "./components/Navbar/Navbar"
import AddFriends from "./components/AddFriends/AddFriends"
import "../static/styles/app.css"

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

	useEffect(() => {
		console.log("<App/> useEffect running")
		setIsLoading(true)
		GetSessionData(loginSessionData, setLoginSessionData)
			.catch((err) => console.error(`session check failed: ${err}`))
			.finally(() => setIsLoading(false))
	}, []) // Runs only once on app mount

	if (isLoading) {
		return (
			<>
				<Navbar username={String(loginSessionData.user?.username)} />
				<Loading />
			</>
		)
	}

	return (
		<>
			<LoginSessionContext.Provider value={LoginSessionContextValue}>
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
						<Route path="/addfriend" element={<AddFriends />} />
						<Route path="/meetups" element={<Meetups />} />
						<Route
							path="/meetups/:meetupId"
							element={<MeetupStandalonePage />}
						/>
						<Route path="/profile" element={<Profile />} />
						<Route path="/settings" element={<Settings />} />
					</Route>

					<Route path="*" element={<PageNotFound />}></Route>
				</Routes>
			</LoginSessionContext.Provider>
		</>
	)
}

export default App
