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
import { useState } from "react"

function App() {
	const [isSessionValid, setIsSessionValid] = useState(false)

	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						<Home
							isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>
				<Route
					path="/login"
					element={
						<Login
							// isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>
				<Route
					path="/signup"
					element={
						<SignUp
						// isSessionValid={isSessionValid}
						/>
					}
				/>
				<Route
					path="/home"
					element={
						<Home
							isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>
				<Route
					path="/friends"
					element={
						<Friends
							isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>
				<Route
					path="/friends/:friendId"
					element={
						<FriendStandalonePage
							isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>
				<Route
					path="/meetups"
					element={
						<Meetups
							isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>
				<Route
					path="/meetups/:meetupId"
					element={
						<MeetupStandalonePage
							isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>
				{/* <Route path="/user" element={<Login />} /> */}
				<Route
					path="/profile"
					element={
						<Profile
							isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>
				<Route
					path="/settings"
					element={
						<Settings
							isSessionValid={isSessionValid}
							setIsSessionValid={setIsSessionValid}
						/>
					}
				/>

				<Route path="*" element={<PageNotFound />}></Route>
			</Routes>
		</>
	)
}

export default App
