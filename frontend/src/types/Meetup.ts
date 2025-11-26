import type { Friend } from "./friend";

export type Meetup = {
    id: number;
    date: string;
    attendees: Array<Friend["id"]>;
    time?: string;
    location?: string;
}
