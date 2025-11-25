import type { Friend } from "./friend";

export type Meetup = {
    time: string | null;
    date: string;
    location: string | null;
    attendees: Friend[] | null;
}
