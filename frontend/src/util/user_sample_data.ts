import type { User } from "../types/user"

const users: Array<User> = [
        {
            id: 1,
            username: 'LyonFromFrance',
            password: 'itsOver9000',
            friends: [1,2,3,4,5],
            meetups: [1,2],

            email: "poopoo@gmail.com",
            birthday: "1957-03-10",
            last_interaction: "2025-11-30",
            last_meetup: "2025-11-29",   
            settings: {
                "receivesNotifications": {
                    "email": false,
                    "push_notifications": false
                },
                "dark_or_light_mode": "light"
            },
        },

        {
            id: 2,
            username: 'marthFireEmblem',
            password: 'RoscosmosSimp',
            friends: [],
            meetups: [],

            settings: {
                "receivesNotifications": {
                    "email": false,
                    "push_notifications": false
                },
                "dark_or_light_mode": "light"
            },
        }
    ]

export default users
