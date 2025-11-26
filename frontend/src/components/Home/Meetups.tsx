import "./styles/dist/Meetups.min.css"
import friends from "../../util/friends_sample_data"
import meetups from "../../util/meetups_sample_data"
import type { Meetup } from "../../types/Meetup"

export default function Meetups() {

    // Render meetups list into UI elements 
    const meetupElements = meetups.map((item: Meetup, index: number) => {

        // Get attendee names from friends data
        const attendeeNames = item.attendees.map(attendeeId => {
            const friend = friends.find(friend => friend.id === attendeeId);
            return friend ? friend.name : null; // Return null if not found
        }).filter(name => name !== null); // Filter out any null values
        
        const date = new Date(item.date)
        const dateString = date.toDateString()

        return(

            <li className="MeetupListItem" id={String(index)} key={index}>
                
                <span className="date">
                    {dateString}
                </span>

                {(item.location != null) && (
                    <span className="location">
                        {item.location}
                    </span>
                )}

                <div className="bottomRow">
                    <div className="attendees">
                        {attendeeNames.length > 0 && (
                            attendeeNames.slice(0, 4).map((name, idx) => (
                                <span className="attendee" key={idx}>{String(name)}</span> // Separate span for each name
                            ))
                        )}
                        {attendeeNames.length < 1 && (
                            <span className="attendee">No attendees.</span> // Separate span for each name
                        )}
                    </div>
                    <button className="view">View</button>
                </div>
                    

            </li>

    )})

    return (
        <>
            <div id="meetups" className="homepage_segment">
                <h2>Meetups:</h2>

                <ul className="meetupList">
                    {meetupElements}
                </ul>
            </div>
        </>
    )
}
