import "./styles/dist/Friends.min.css"
import { daysSinceDate } from "../../util/dates"
import type { Friend } from "../../types/Friend"

export default function Friends() {

    const friends: Array<Friend> = [
        {
            id: 1,
            name: "Natalia Tabja",
            last_interaction: "2025-11-22",
            last_meetup: "2025-09-28",
            meetup_plans: null,
            birthday: null,
            profile_image: null,
        },
        {
            id: 2,
            name: "马健炯",
            last_interaction: "2025-11-23",
            last_meetup: null,
            meetup_plans: null,
            birthday: null,
            profile_image: null,
        },
        {
            id: 3,
            name: "Simon",
            last_interaction: null,
            last_meetup: "2025-10-26",
            meetup_plans: null,
            birthday: null,
            profile_image: null,
        },
        {
            id: 4,
            name: "Mohamad Al-Sheikh",
            last_interaction: null,
            last_meetup: null,
            meetup_plans: null,
            birthday: null,
            profile_image: null,
        },
        {
            id: 5,
            name: "Denis Torjai of Transylvania",
            last_interaction: "2025-11-18",
            last_meetup: "2025-10-15",
            meetup_plans: null,
            birthday: null,
            profile_image: null,
        }
    ]

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
                <h2>Friends:</h2>

                <ul className="friendList">
                    {friendElements}
                </ul>
            </div>
        </>
    )
}
