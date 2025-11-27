import type { Friend } from "../types/friend"

const friends: Array<Friend> = [
        {
            id: 1,
            name: "Natalia Tabja",
            last_interaction: "2025-11-22",
            last_meetup: "2025-09-28",
            meetup_plans: null,
            birthday: null,
            profile_image_path: "path/to/image",
            alerts: [],
        },
        {
            id: 2,
            name: "马健炯",
            last_interaction: "2025-11-23",
            last_meetup: null,
            meetup_plans: null,
            birthday: null,
            profile_image_path: "path/to/image",
        },
        {
            id: 3,
            name: "Simon",
            last_interaction: null,
            last_meetup: "2025-10-26",
            meetup_plans: null,
            birthday: null,
            profile_image_path: "path/to/image",
        },
        {
            id: 4,
            name: "Mohamad Al-Sheikh",
            last_interaction: null,
            last_meetup: null,
            meetup_plans: null,
            birthday: null,
            profile_image_path: null,
        },
        {
            id: 5,
            name: "Denis Torjai of Transylvania",
            last_interaction: "2025-11-18",
            last_meetup: "2025-10-15",
            meetup_plans: null,
            birthday: null,
            profile_image_path: null,
        }
    ]

export default friends
