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
import type { User } from "./types/models/User"
import { UserContext } from "./contexts/auth"
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes"
import Meetups from "./components/Meetups/Meetups"
import MeetupStandalonePage from "./components/Meetups/MeetupStandalonePage"
import Settings from "./components/Settings/Settings"
import "../static/styles/dist/app.min.css"

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
	const [user, setUser] = useState<User | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(true)

	return (
		<UserContext.Provider value={user}>
			<Routes>
				<Route path="/login" element={<Login setUser={setUser} />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/signup" element={<SignUp />} />

				<Route
					element={
						<ProtectedRoutes
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					}
				>
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Home />} />
					<Route path="/friends" element={<Friends />} />
					<Route
						path="/friends/:friendId"
						element={<FriendStandalonePage />}
					/>
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
		</UserContext.Provider>
	)
}

export default App
