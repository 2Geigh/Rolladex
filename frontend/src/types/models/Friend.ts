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

export function GetRelationshipTierInfo(
	relationship_tier_code: number | undefined,
): RelationshipTier {
	let name
	let emoji

	switch (relationship_tier_code) {
		case 1:
			name = "inner clique"
			emoji = "🫂"
			break

		case 2:
			name = "close friend"
			emoji = "🍷"
			break

		case 3:
			name = "ordinary friend"
			emoji = "☕"
			break

		case 4:
			name = "acquaintance" // 'I know a guy' kinda friendships
			emoji = "🤝"
			break

		default:
			name = ""
			emoji = "👤"
	}

	return { code: relationship_tier_code, name: name, emoji: emoji }
}

type RelationshipTier = {
	code: number | undefined
	name: string
	emoji: string
}
