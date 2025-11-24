import type { Meetup } from "./Meetup";

export type Friend = {
        id: number;
        name: string | FormDataEntryValue;
        last_interaction?: string | FormDataEntryValue | null;
        last_meetup?: string | FormDataEntryValue | null;
        meetup_plans?: Array<Meetup> | null;
        birthday?: string | null;
        profile_image?: string | null;
    }
