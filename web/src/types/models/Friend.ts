import type { Interaction } from "./Interaction"

export const MAX_NUMBER_OF_FRIENDS = 150
export const MAX_NAME_LENGTH = 50

export type Friend = {
	id: number
	name: string
	last_meetup_date?: Date
	last_interaction?: Interaction
	birthday_month: number
	birthday_day: number
	profile_image_path?: string
	relationship_tier: number
	relationship_health: number
	days_since_last_interaction?: number
	notes?: string
	created_at?: Date
	updated_at?: Date
}

export type RelationshipTier = {
	code: number | undefined
	name: string
	emoji: string
	description: string
	max: number
}

export const DefaultRelationshipTiers: Record<number, RelationshipTier> = {
	1: {
		code: 1,
		name: "Inner clique",
		emoji: "🫂",
		description: `Someone you'd be happy to call a co-founder of your life, and vice-versa`,
		max: 5,
	},
	2: {
		code: 2,
		name: "Close friend",
		emoji: "🍷",
		description: `Someone you can confide in and depend on when times are tough`,
		max: 15,
	},
	3: {
		code: 3,
		name: "Ordinary friend",
		emoji: "☕",
		description: `Someone you can reliably hang out with and trust for a favour. Reciprocating such reliability should be more than okay with you`,
		max: 50,
	},
	4: {
		code: 4,
		name: "Acquaintance",
		emoji: "🤝",
		description: `Someone you know on a first-name basis, nothing too deep, and that's alright with you`,
		max: MAX_NUMBER_OF_FRIENDS,
	},
}

export function GetRelationshipTierInfo(
	relationship_tier_code: number | undefined,
): RelationshipTier {
	if (
		relationship_tier_code === undefined ||
		relationship_tier_code < 1 ||
		relationship_tier_code > 4
	) {
		return {
			code: undefined,
			name: "Uncategorised",
			emoji: "👤",
			description: "This is a relationship of an undefined tier.",
			max: MAX_NUMBER_OF_FRIENDS,
		}
	}

	return DefaultRelationshipTiers[relationship_tier_code]
}
