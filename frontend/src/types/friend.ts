import type { image_path } from "./image_path";
import type { JsonDate } from "./jsonDate";
import type { Meetup } from "./Meetup";

export type Friend = {
        id: number;
        name: string | FormDataEntryValue;
        last_interaction?: JsonDate | FormDataEntryValue | null;
        last_meetup?: JsonDate | FormDataEntryValue | null;
        meetup_plans?: Array<Meetup["id"]> | null;
        birthday?: JsonDate | null;
        profile_image_path?: image_path | null;
        alerts?: Array<string>;
    }
