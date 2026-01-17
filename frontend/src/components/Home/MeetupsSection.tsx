import "./styles/Meetups.css"
import type { Friend } from "../../types/models/Friend"
import type React from "react"
import type { Interaction } from "../../types/models/Interaction"

// const getRandomColor = () => {
//     const hue = Math.floor(Math.random() * 360);
//     return `hsl(${hue}, 100%, 50%)`;
// };

// type AttendeeProps = {
//     friend: Friend;
// }
// const Attendee: React.FC<AttendeeProps> = ({ friend }) => {
//     const randomColor = getRandomColor();

//     return friend.profile_image_path ? (
//         <img
//             src={friend.profile_image_path}
//             alt={String(friend.name)[0]}
//             className="attendeeMinimizedImg"
//             style={{ backgroundColor: randomColor }}
//         />
//     ) : (
//         <div
//             className="attendeeMinimizedImg"
//             style={{ backgroundColor: randomColor }}
//         >
//             {String(friend.name)[0]}
//         </div>
//     );
// };

type MeetupItemProps = {
	meetup: Interaction
	friends: Friend[]
}
const MeetupItem: React.FC<MeetupItemProps> = ({ meetup }) => {
	// const attendeeNames = meetup.attendees
	//     .map(attendeeId => friends.find(friend => friend.id === attendeeId))
	//     .filter((friend) => friend !== undefined);

	return (
		<li className="MeetupListItem" key={meetup.id}>
			<div className="timeAndPlace">
				<span className="date">
					{new Date(meetup.date).toDateString()}
				</span>
				{meetup.location && (
					<span className="location">
						&#x1F4CD; {meetup.location}
					</span>
				)}
			</div>
			<div className="bottomRow">
				{/* <div className={`attendees ${attendeeNames.length < 1 ? 'noPadding' : ''}`}>
                    {attendeeNames.length > 0 ? (
                        attendeeNames.slice(0, 4).map((friend: Friend, idx: number) => (
                            <Attendee friend={friend} key={idx} />
                        ))
                    ) : (
                        <span className="noAttendees">No attendees.</span>
                    )}
                </div> */}
				<a className="view" href={`/meetups/${meetup.id}`}>
					View
				</a>
			</div>
		</li>
	)
}

function MeetupsSection() {
	return (
		<>
			<div id="meetups" className="homepage_segment">
				<h2>Meetups:</h2>
				{/* <ul className="meetupList">
                    {meetups.map((meetup: Meetup) => (
                        <MeetupItem meetup={meetup} friends={friends} key={meetup.id} />
                    ))}
                </ul> */}
			</div>
		</>
	)
}

export { MeetupsSection, MeetupItem }
