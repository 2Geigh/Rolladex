import "./styles/dist/Friends.min.css"
import { daysSinceDate } from "../../util/dates"
import type { Friend } from "../../types/friend";
import friends from "../../util/friends_sample_data"

const NameAndPhoto: React.FC<{ ID: Friend["id"], name: Friend["name"], profile_image_path: Friend["profile_image_path"]}> = ( { ID, name, profile_image_path } ) => {

    const profilePath = `/friends/${String(ID)}`;

    return (
        <div className="nameAndPhoto">

            <a href={profilePath} className="name">{String(name)}</a>

            <a href={profilePath}>
                <img src={String(profile_image_path)} alt={String(name)} className="profile_photo" />
            </a>

        </div>
    )
}

const DaysSinceLastInteraction: React.FC<{ lastInteractionDays: number}> = ( { lastInteractionDays } ) => {
    return (
        <>
                        <span className="lastTime" id="friendLastInteraction">
                            <span className="label">Last interaction:</span>
                            <span className="daysAgo">
                                { !isNaN(lastInteractionDays) && (
                                    <span className="numberOfDays">{lastInteractionDays}</span>
                                )}
                                { isNaN(lastInteractionDays) && (
                                    <span className="numberOfDays">?</span>
                                )}
                                <br />
                                days ago
                            </span>
                        </span>
        </>
    )
}

const DaysSinceLastMeetup: React.FC<{lastMeetupDays: number}> = ({ lastMeetupDays }) => {
    return (
        <>
                        <span className="lastTime" id="friendLastMeetup">
                            <span className="label">Last meetup:</span>
                            
                            <span className="daysAgo">
                                { !isNaN(lastMeetupDays) && (
                                    <span className="numberOfDays">{lastMeetupDays}</span>
                                )}
                                { isNaN(lastMeetupDays) && (
                                    <span className="numberOfDays">?</span>
                                )}
                                <br />
                                days ago
                            </span>
                        </span>

        </>
    )
}

export default function FriendsSection() {

    // Render friends list into UI elements 
    const friendElements = friends.map((item: Friend, index: number) => {
        const lastInteractionDays = daysSinceDate(String(item.last_interaction));
        const lastMeetupDays = daysSinceDate(String(item.last_meetup));

        return (
            <li className="friendListItem" id={String(index)} key={index}>
                
                <NameAndPhoto ID={item.id} name={item.name} profile_image_path={item.profile_image_path}/>

                {/* { (!isNaN(lastInteractionDays) || !isNaN(lastMeetupDays)) && ( */}
                    <div className="previousTimes">

                        <DaysSinceLastInteraction lastInteractionDays={lastInteractionDays} />

                        <DaysSinceLastMeetup lastMeetupDays={lastMeetupDays}/>

                    </div>
                {/* )} */}
                

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
