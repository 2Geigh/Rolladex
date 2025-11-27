import type { Meetup } from "../types/Meetup"
const meetups: Array<Meetup> = [
        {
            id: 9001,
            date: "2001-09-11",
            time: "08:46",
            location: "Manhattan",
            attendees: [1,2,3,4]
        },
        {
            id: 9002,
            date: "1993-02-26",
            attendees: [4,2],
        },
        {
            id: 9002,
            date: "1995-04-19",
            location: "Oklahoma City",
            attendees: [],
        },
    ]

export default meetups
