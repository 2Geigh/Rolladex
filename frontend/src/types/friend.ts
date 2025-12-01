import type { image_path } from "./image_path";
import type { Meetup } from "./Meetup";

export type Friend = {
        id: number;
        name: string;
        last_interaction?: Date;
        last_meetup?: Date;
        meetup_plans?: Array<Meetup["id"]>;
        birthday?: Date;
        profile_image_path?: image_path;
        alerts?: Array<string>;
    }
