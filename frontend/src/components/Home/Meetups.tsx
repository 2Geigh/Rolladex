import "./styles/dist/Meetups.min.css"
import friends from "../../util/friends_sample_data"
import meetups from "../../util/meetups_sample_data"
import type { Meetup } from "../../types/Meetup"
import type { Friend } from "../../types/friend"
import type React from "react"

const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
};

type AttendeeProps = {
    friend: Friend;
}
const Attendee: React.FC<AttendeeProps> = ({ friend }) => {
    const randomColor = getRandomColor();

    return friend.profile_image_path ? (
        <img
            src={friend.profile_image_path}
            alt={String(friend.name)[0]}
            className="attendeeMinimizedImg"
            style={{ backgroundColor: randomColor }}
        />
    ) : (
        <div
            className="attendeeMinimizedImg"
            style={{ backgroundColor: randomColor }}
        >
            {String(friend.name)[0]}
        </div>
    );
};

type MeetupItemProps = {
    item: Meetup;
    friends: Friend[];
}
const MeetupItem: React.FC<MeetupItemProps> = ({ item, friends }) => {
    const attendeeNames = item.attendees
        .map(attendeeId => friends.find(friend => friend.id === attendeeId))
        .filter((friend) => friend !== undefined);

    return (
        <li className="MeetupListItem" key={item.id}>
            <div className="timeAndPlace">
                <span className="date">{new Date(item.date).toDateString()}</span>
                {item.location && (
                    <span className="location">
                        &#x1F4CD; {item.location}
                    </span>
                )}
            </div>
            <div className="bottomRow">
                <div className={`attendees ${attendeeNames.length < 1 ? 'noPadding' : ''}`}>
                    {attendeeNames.length > 0 ? (
                        attendeeNames.slice(0, 4).map((friend: Friend, idx: number) => (
                            <Attendee friend={friend} key={idx} />
                        ))
                    ) : (
                        <span className="noAttendees">No attendees.</span>
                    )}
                </div>
                <a className="view" href={`/meetups/${item.id}`}>
                    View
                </a>
            </div>
        </li>
    );
};

export default function Meetups() {
    return (
        <>
            <div id="meetups" className="homepage_segment">
                <h2>Meetups:</h2>
                <ul className="meetupList">
                    {meetups.map((item: Meetup) => (
                        <MeetupItem item={item} friends={friends} key={item.id} />
                    ))}
                </ul>
            </div>
        </>
    );
}
