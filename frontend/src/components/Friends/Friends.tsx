import FriendsSection from "../Home/FriendsSection"
import Navbar from "../Navbar/Navbar"
import meetups from "../../util/meetups_sample_data"
import "./styles/dist/Friends.min.css"
import Footer from "../Footer/Footer"
import { RedirectIfSessionInvalid } from "../../contexts/auth"
import { useLayoutEffect } from "react"
import { Navigate } from "react-router"
import { UseAuthContext } from "../../contexts/auth"

const MeetupPlansLabel = () => {
	return (
		<label htmlFor="meetupPlans">
			Meetup plans:{" "}
			<select name="meetupPlans" id="meetupPlans">
				<option className="meetupPlansOption" key={-1} value={"None"}>
					None
				</option>
				{meetups.map((/*meetup, index*/) => {
					return <></>
				})}
			</select>
		</label>
	)
}

const AddFriend: React.FC = () => {
	const currentYear = new Date().getFullYear()

	return (
		<>
			<div id="addFriendSection">
				<h2>Add friend:</h2>

				<form id="addFriend" method="POST" action="/friends">
					<h3>Friend creation form</h3>

					<label htmlFor="name">
						<span>
							Name{" "}
							<span className="requiredLabel">(required)</span>
						</span>
						<input required name="name" type="text"></input>
					</label>

					<label htmlFor="lastInteraction">
						Last interaction:
						<input name="lastInteraction" type="date"></input>
					</label>

					<label htmlFor="lastMeetup">
						Last meetup:
						<input name="lastMeetup" type="date"></input>
					</label>

					<MeetupPlansLabel />

					<label id="birthdayLabel">
						Birthday:
						<div className="inputs">
							<input
								name="birthdayDay"
								type="number"
								placeholder="Day"
								min={1}
								max={31}
							></input>
							<input
								name="birthdayMonth"
								type="number"
								placeholder="Month"
								min={1}
								max={12}
							></input>
							<input
								name="birthdayYear"
								type="number"
								placeholder="Year"
								min={1}
								max={currentYear}
							></input>
						</div>
					</label>

					{/* <label htmlFor="profilePhoto">
                        Last meetup:
                        <input name="profilePhoto" type="file"></input>
                    </label> */}

					<input
						id="addFriendButton"
						type="submit"
						value="Add friend"
					></input>
				</form>
			</div>
		</>
	)
}

const Friends: React.FC = () => {
	// Validate login session before component renders
	const authContext = UseAuthContext()
	useLayoutEffect(() => {
		RedirectIfSessionInvalid(
			authContext.isSessionValid,
			authContext.setIsSessionValid,
		)
	}, [authContext.isSessionValid, authContext.setIsSessionValid])
	if (!authContext.isSessionValid) {
		return <Navigate to="/login" />
	}

	return (
		<>
			<Navbar />
			<div className="content">
				<AddFriend />
				<FriendsSection />
			</div>
			<Footer />
		</>
	)
}

export default Friends
