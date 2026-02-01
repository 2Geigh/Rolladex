import type { Friend } from "./Friend"

export type Interaction = {
	id: number
	date: Date
	attendees: Array<Friend>
	interaction_type?: string
	name?: string
	location?: string
	created_at?: Date
	updated_at?: Date
}

export type InteractionAttendee = {
	id: number
	interaction_id: Interaction["id"]
	friend_id: Friend["id"]

	created_at?: Date
	updated_at?: Date
}
