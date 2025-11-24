import type { Friend } from "./Friend";

export type Meetup = {
    time: string | null;
    date: string;
    location: string | null;
    attendees: Friend[] | null;
}
