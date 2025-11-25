import "./styles/dist/Meetups.min.css"
import friends from "../../util/friends_sample_data"
import { daysSinceDate } from "../../util/dates"
import type { Friend } from "../../types/friend"

export default function Meetups() {

    // Render friends list into UI elements 
    const friendElements = friends.map((item: Friend, index: number) => {
        return(

            <li className="friendListItem" id={String(index)} key={index}>
                <div className="nameAndPhoto">
                    <a href={`/friends/${String(item.id)}`} className="name">{String(item.name)}</a>
                    <a href={`/friends/${String(item.id)}`}><img src={String(item.profile_image)} alt={String(item.name)} className="profile_photo" /></a>
                </div>

                <div className="previousTimes">
                    <span className="lastTime" id="friendLastInteraction">
                        <span className="label">Last interaction:</span>
                        <span className="daysAgo">
                            <span className="numberOfDays">
                                {daysSinceDate(String(item.last_interaction))}
                            </span>
                            <br></br>
                            days ago
                        </span>
                    </span>

                    <span className="lastTime" id="friendLastMeetup">
                        <span className="label">Last meetup:</span>
                        <span className="daysAgo">
                            <span className="numberOfDays">
                                {daysSinceDate(String(item.last_meetup))}
                            </span>
                            <br></br>
                            days ago
                        </span>
                    </span>
                </div>

                <div className="deleteAndOptionalAlert">
                    <div className="alert">No alerts yet.</div>
                    <button className="deleteFriend">Delete friend</button>
                </div>

            </li>

    )})

    return (
        <>
            <div id="friends" className="homepage_segment">
                <h2>Meetups:</h2>

                <ul className="friendList">
                    {friendElements}
                </ul>
            </div>
        </>
    )
}
