import { Route, Routes } from "react-router"
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


function App() {



  return (
    <>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friends/:friendId" element={<FriendStandalonePage />} />
          <Route path="/meetups" element={<Meetups />} />
          <Route path="/meetups/:meetupId" element={<MeetupStandalonePage />} />
          {/* <Route path="/user" element={<Login />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
