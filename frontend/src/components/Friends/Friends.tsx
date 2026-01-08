import "./styles/dist/Friends.min.css"

function goToNextPage() {}

function goToPreviousPage() {}

const Friends: React.FC = () => {
	const hubert_date = new Date("2025-12-25")
	const hubert_birthday = new Date("2002-01-08")
	const ID = 1

	// "name",
	// 		"last_interaction_date",
	// 		"last_meetup_date",
	// 		"birthday",
	// 		"relationship_tier",

	return (
		<>
			<div id="friendsContent">
				<div id="friendsWrapper">
					<header>
						<h2>Friends</h2>
						<div className="sortBy">
							<select name="sortby" id="sortbyOptions">
								<option className="option" value="name">
									Name
								</option>
								<option value="relationship_tier">
									Relationship
								</option>
								<option value="last_interaction_date">
									Last interaction
								</option>
								{/* <option value="last_meetup_date">Last meetup</option> */}
								<option value="birthday">Birthday</option>
							</select>
							<label htmlFor="sortby" id="sortby">
								Sort by:
							</label>
						</div>
					</header>

					<table id="friendList">
						<thead>
							<tr className="labels">
								<th id="name">Name</th>
								<th id="relationship">Relationship</th>
								<th id="last_interaction">Last interaction</th>
								<th id="birthday">Birthday</th>
								<th id="created_at">Date added</th>
							</tr>
						</thead>

						<tbody>
							<tr>
								<td className="name">
									<a href={`/friends/${ID}`}>Hubert Wilson</a>
								</td>
								<td className="relationship">
									<div className="emoji">🫂</div>
									<br></br>
									<div className="relationship_title">
										Inner Clique
									</div>
								</td>

								<td className="last_interaction">
									<a href={`/meetups/${ID}`}>
										{hubert_date.toLocaleDateString(
											"en-US",
											{
												year: "numeric",
												month: "short",
												day: "2-digit",
												weekday: "long",
											},
										)}
									</a>
								</td>
								<td className="birthday">
									{hubert_date.toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</td>
								<td className="created_at">
									{hubert_date.toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</td>
							</tr>
							<tr>
								<td className="name">
									<a href={`/friends/${ID}`}>Hubert Wilson</a>
								</td>
								<td className="relationship">
									<div className="emoji">🫂</div>
									<br></br>
									<div className="relationship_title">
										Inner Clique
									</div>
								</td>

								<td className="last_interaction">
									<a href={`/meetups/${ID}`}>
										{hubert_date.toLocaleDateString(
											"en-US",
											{
												year: "numeric",
												month: "short",
												day: "2-digit",
												weekday: "long",
											},
										)}
									</a>
								</td>
								<td className="birthday">
									{hubert_date.toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</td>
								<td className="created_at">
									{hubert_date.toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</td>
							</tr>
							<tr>
								<td className="name">
									<a href={`/friends/${ID}`}>Hubert Wilson</a>
								</td>
								<td className="relationship">
									<div className="emoji">🫂</div>
									<br></br>
									<div className="relationship_title">
										Inner Clique
									</div>
								</td>

								<td className="last_interaction">
									<a href={`/meetups/${ID}`}>
										{hubert_date.toLocaleDateString(
											"en-US",
											{
												year: "numeric",
												month: "short",
												day: "2-digit",
												weekday: "long",
											},
										)}
									</a>
								</td>
								<td className="birthday">
									{hubert_date.toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</td>
								<td className="created_at">
									{hubert_date.toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</td>
							</tr>
						</tbody>
					</table>

					<div id="pagenav">
						<div
							className="arrow"
							id="left"
							onClick={goToPreviousPage}
						>
							〈
						</div>
						<div className="buttons">
							<a href="/friends" className="button selected">
								1
							</a>
							<a href="/friends" className="button">
								2
							</a>
							<a href="/friends" className="button">
								3
							</a>
							<div className="button" id="ellipsis">
								&#8943;
							</div>
							<a href="/friends" className="button">
								7
							</a>
						</div>
						<div
							className="arrow"
							id="right"
							onClick={goToNextPage}
						>
							〉
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Friends
