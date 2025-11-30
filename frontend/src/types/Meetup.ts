import type { Friend } from "./friend";

export type Meetup = {
    id: number;
    date: string;
    attendees: Array<Friend["id"]>;
    
    name?: string;
    time?: string;
    location?: string;
}
