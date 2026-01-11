import type { Interaction } from "./Interaction"

export type Friend = {
	id: number
	name: string
	last_meetup_date?: Date
	last_interaction?: Interaction
	birthday?: Date
	profile_image_path?: string
	relationship_tier: number
	created_at?: Date
	updated_at?: Date
}

export type RelationshipTier = {
	code: number | undefined
	name: string
	emoji: string
	description: string
}

export const DefaultRelationshipTiers: Record<number, RelationshipTier> = {
	1: { code: 1, name: "Inner clique", emoji: "🫂", description: "🫂" },
	2: { code: 2, name: "Close friend", emoji: "🍷", description: "🍷" },
	3: { code: 3, name: "Ordinary friend", emoji: "☕", description: "☕" },
	4: { code: 4, name: "Acquaintance", emoji: "🤝", description: "🤝" },
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
		}
	}

	return DefaultRelationshipTiers[relationship_tier_code]
}
