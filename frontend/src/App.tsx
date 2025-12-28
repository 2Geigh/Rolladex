import { Routes, Route } from "react-router-dom"
import Login from "./components/Login/Login"
import SignUp from "./components/Signup/Signup"
import Home from "./components/Home/Home"
import Friends from "./components/Friends/Friends"
import FriendStandalonePage from "./components/Friends/FriendStandalonePage"
import Meetups from "./components/Meetups/Meetups"
import MeetupStandalonePage from "./components/Meetups/MeetupStandalonePage"
import Profile from "./components/Profile/Profile"
import Settings from "./components/Settings/Settings"
import "../static/styles/dist/app.min.css"
import PageNotFound from "./components/PageNotFound/PageNotFound"
import { AuthContext } from "./contexts/auth"
import { useState } from "react"

function App() {
	const [isSessionValid, setIsSessionValid] = useState(false)

	return (
		<>
			<AuthContext.Provider value={{ isSessionValid, setIsSessionValid }}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/login"
						element={
							<Login setIsSessionValid={setIsSessionValid} />
						}
					/>
					<Route path="/signup" element={<SignUp />} />
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

					<Route path="*" element={<PageNotFound />}></Route>
				</Routes>
			</AuthContext.Provider>
		</>
	)
}

export default App
