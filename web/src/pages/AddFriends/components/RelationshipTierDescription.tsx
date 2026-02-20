import { GetRelationshipTierInfo } from '../../../types/models/Friend'

type RelationshipTierDescriptionProps = {
	relationship_tier_code: number | undefined
}

const RelationshipTierDescription: React.FC<
	RelationshipTierDescriptionProps
> = ({ relationship_tier_code }) => {
	const relationship_tier = GetRelationshipTierInfo(relationship_tier_code)

	return (
		<p className='relationship_tier_description'>
			{relationship_tier_code ?
				relationship_tier.description + '.'
			:	'Hover over a relationship type to see its description.'}
		</p>
	)
}

export default RelationshipTierDescription
