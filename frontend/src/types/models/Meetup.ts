import type { Friend } from "./Friend";
import type { User } from "./User";

export type Meetup = {
    id: number;
    date: Date;
    location?: string;
    name?: string;
    organizerId: User["id"];
    createdAt?: Date;
    updatedAt?: Date;
}

export type MeetupAttendee = {
    id: number;
    meetupId: Meetup["id"];
    friendId: Friend["id"];
    createdAt?: Date;
    updatedAt?: Date;
}

export type Interaction = {
    id: number;
    date: string;
    userId: User["id"];
    friendId: Friend["id"];
    interactionType?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
