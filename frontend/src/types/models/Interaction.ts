import type { Friend } from "./Friend"
import type { User } from "./User"

export type Interaction = {
	id: number
	date: Date
	user_id: User["id"]
	friend_id: Friend["id"]

	interaction_type?: string
	attendees?: Array<Friend>
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
