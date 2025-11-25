import "./styles/dist/Friends.min.css"
import { daysSinceDate } from "../../util/dates"
import type { Friend } from "../../types/friend";
import friends from "../../util/friends_sample_data"

export default function Friends() {

    // Render friends list into UI elements 
    const friendElements = friends.map((item: Friend, index: number) => {
        const lastInteractionDays = daysSinceDate(String(item.last_interaction));
        const lastMeetupDays = daysSinceDate(String(item.last_meetup));

        return (
            <li className="friendListItem" id={String(index)} key={index}>
                <div className="nameAndPhoto">
                    <a href={`/friends/${String(item.id)}`} className="name">{String(item.name)}</a>
                    <a href={`/friends/${String(item.id)}`}>
                        <img src={String(item.profile_image)} alt={String(item.name)} className="profile_photo" />
                    </a>
                </div>

                { (!isNaN(lastInteractionDays) || !isNaN(lastMeetupDays)) && (
                    <div className="previousTimes">
                        { !isNaN(lastInteractionDays) && (
                            <span className="lastTime" id="friendLastInteraction">
                                <span className="label">Last interaction:</span>
                                <span className="daysAgo">
                                    <span className="numberOfDays">{lastInteractionDays}</span><br />
                                    days ago
                                </span>
                            </span>
                        )}

                        { !isNaN(lastMeetupDays) && (
                            <span className="lastTime" id="friendLastMeetup">
                                <span className="label">Last meetup:</span>
                                <span className="daysAgo">
                                    <span className="numberOfDays">{lastMeetupDays}</span><br />
                                    days ago
                                </span>
                            </span>
                        )}
                    </div>
                )}
                

                <div className="deleteAndOptionalAlert">
                    <div className="alert">No alerts yet.</div>
                    <button className="deleteFriend">Delete friend</button>
                </div>
            </li>
        );
    });

    return (
        <>
            <div id="friends" className="homepage_segment">
                <h2>Friends:</h2>
                <ul className="friendList">
                    {friendElements}
                </ul>
            </div>
        </>
    );
}
