import type { Friend } from "./friend";

export type Meetup = {
    id: number;
    date: string;
    time?: string | null;
    location?: string | null;
    attendees?: Array<Friend["id"]> | null;
}
