import FriendsSection from "../Home/FriendsSection"
import Navbar from "../Navbar/Navbar"
import meetups from "../../util/meetups_sample_data"
import type { Meetup } from "../../types/Meetup"
import friends from "../../util/friends_sample_data"
import "./styles/dist/Friends.min.css"
import Footer from "../Footer/Footer"

const formatAttendees = (attendeesIds: number[]): string => {
    const attendees = attendeesIds.map(id => friends.find(friend => friend.id === id)?.name).filter(Boolean);
    const attendeesCount = attendees.length;

    if (attendeesCount === 0) {
        return '';  
    } else if (attendeesCount === 1) {
        return ` with ${attendees[0]}`;
    } else {
        return attendeesCount === 2 ? ` with ${attendees[0]} and ${attendees[1]}` : ` with ${attendees[0]}, ${attendees[1]}, etc.`;
    }
};

const formatDateTime = (meetup: Meetup): string => {
    const date = meetup.date
    const time = meetup.time

    if (time) {
        return `${date} at ${time}`
    } else {
        return `${date}`
    }
}

const generateOptionText = (meetup: Meetup): string => {
    
    const locationText = formatDateTime(meetup)
    const attendeesString = formatAttendees(meetup.attendees);

    return `${locationText}${attendeesString}`
};

const MeetupPlansLabel = () => {



    return (
                <label htmlFor="meetupPlans">
                    Meetup plans: <select name="meetupPlans" id="meetupPlans">
                        <option className="meetupPlansOption" key={-1} value={"None"}>None</option>
                        {meetups.map((meetup, index) => {

                            return (
                                <option className="meetupPlansOption" key={index} value={meetup.id}>{generateOptionText(meetup)}</option>
                            )
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
                            
                    <h3>
                        Friend creation form
                    </h3>

                    <label htmlFor="name">
                        <span>Name <span className="requiredLabel">(required)</span></span>
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

                    <MeetupPlansLabel/>

                    <label id="birthdayLabel">
                        Birthday:
                        <div className="inputs">
                            <input name="birthdayDay" type="number" placeholder="Day" min={1} max={31}></input>
                            <input name="birthdayMonth" type="number" placeholder="Month" min={1} max={12}></input>
                            <input name="birthdayYear" type="number" placeholder="Year" min={1} max={currentYear}></input>
                        </div>
                    </label>

                    {/* <label htmlFor="profilePhoto">
                        Last meetup:
                        <input name="profilePhoto" type="file"></input>
                    </label> */}
                    
                    <input id="addFriendButton" type="submit" value="Add friend"></input>
                </form>
            </div>
        </>
    )
}

const Friends = () => {
    return (
        <>
            <Navbar/>
            <div className="content">
                <AddFriend/>
                <FriendsSection/>
            </div>
            <Footer/>
        </>
    )
}

export default Friends
