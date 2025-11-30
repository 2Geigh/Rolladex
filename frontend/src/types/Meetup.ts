import type { Friend } from "./friend";
import type { JsonDate } from "./jsonDate";

export type Meetup = {
    id: number;
    date: JsonDate;
    attendees: Array<Friend["id"]>;
    
    name?: string;
    time?: string;
    location?: string;
}
