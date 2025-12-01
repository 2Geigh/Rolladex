import type { Friend } from "./friend";
import type { image_path } from "./image_path";
import type { JsonDate } from "./jsonDate";
import type { Meetup } from "./Meetup";

type recievesNotificationsValue = {
    "email": boolean,
    "push_notifications": boolean
}

type Settings = {
    "receivesNotifications": recievesNotificationsValue,
    "dark_or_light_mode": ("dark" | "light" | "auto")
}

type Email = string;

export type User = {
        id: number;
        username: string;
        password: string;
        friends: Array<Friend["id"]>;
        meetups: Array<Meetup["id"]>;
        settings: Settings

        email?: Email | null;
        profile_image_path?: image_path;
        birthday?: JsonDate;
        last_interaction?: JsonDate;
        last_meetup?: JsonDate;        
    }
