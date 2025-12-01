import type { Friend } from "../types/friend"

const friends: Array<Friend> = [
        {
            id: 1,
            name: "Natalia Tabja",
            last_interaction: new Date("2025-11-22"),
            last_meetup: new Date("2025-09-28"),
            profile_image_path: "path/to/image",
            alerts: [],
        },
        {
            id: 2,
            name: "马健炯",
            last_interaction: new Date("2025-11-23"),
            profile_image_path: "path/to/image",
        },
        {
            id: 3,
            name: "Simon",
            last_meetup: new Date("2025-10-26"),
            profile_image_path: "path/to/image",
        },
        {
            id: 4,
            name: "محمد الشيخ",
        },
        {
            id: 5,
            name: "Denis I of House Torjai from Transylvania",
            last_interaction: new Date("2025-11-18"),
            last_meetup: new Date("2025-10-15"),
        }
    ]

export default friends
