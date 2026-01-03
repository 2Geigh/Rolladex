export type Friend = {
	id: number
	name: string
	last_meetup_date?: Date
	last_interaction_date?: Date
	birthday?: Date
	profile_image_path?: string
	relationship_tier: number
	created_at?: Date
	updated_at?: Date
}
