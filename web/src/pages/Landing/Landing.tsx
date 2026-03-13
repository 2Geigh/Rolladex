import { Link } from 'react-router-dom';
import './Landing.scss';

const Landing = () => {
	return (
		<div id='landingContainer'>
			<header className='hero'>
				<div className='hero-content'>
					<h1>Maintain Your IRL Network.</h1>
					<p>
						Track your social connections, log critical social
						dates, and combat relationship decay with outreach
						reminders.
					</p>
					<div className='cta-buttons'>
						<Link to='/login' className='cta-button' id='toApp'>
							Open App
						</Link>
						<Link
							to={`https://github.com/2geigh/rolladex`}
							className='cta-button'
							id='github'
						>
							<img
								src='../../../static/images/GItHub-silhouette.png'
								alt='GitHub'
							/>
							Github
						</Link>
					</div>
				</div>
			</header>

			{/* <section className='features'>
				<div className='feature-card'>
					<h2>Connection Decay Tracking</h2>
					<p>
						Receive explicit notifications when it is time to reach
						out to specific individuals based on configured temporal
						cadences.
					</p>
				</div>
				<div className='feature-card'>
					<h2>Event Management</h2>
					<p>
						Log and track critical dates including birthdays and
						anniversaries to ensure timely communication and
						relationship maintenance.
					</p>
				</div>
				<div className='feature-card'>
					<h2>Data Sovereignty</h2>
					<p>
						Retain absolute control over your social graph.
						Instantiate the API, database, and client locally via
						Docker Compose.
					</p>
				</div>
			</section> */}

			{/* <section id='devProgress'>
				<div id='alpha'>
					<h3>Alpha</h3>
					<ul>
						<li>
							<span className='checkbox'>✓</span>
							<span className='feature'>
								Add, edit, and delete friends
							</span>
						</li>
						<li>
							<span className='checkbox'>✓</span>
							<span className='feature'>
								User ability to signup and login
							</span>
						</li>
						<li>
							<span className='checkbox'>✓</span>
							<span className='feature'>Add interactions</span>
						</li>

						<li>
							<span className='checkbox'>◯</span>
							<span className='feature'>
								User ability to set timezone
							</span>
						</li>
					</ul>
				</div>
				<div id='beta'>
					<h3>Beta</h3>
					<ul>
						<li>
							<span className='checkbox'>◯</span>
							<span className='feature'>OAuth login</span>
						</li>
						<li>
							<span className='checkbox'>◯</span>
							<span className='feature'>
								<i>Edit</i> and <i>delete</i> functionality for
								interactions
							</span>
						</li>
						<li>
							<span className='checkbox'>◯</span>
							<span className='feature'>
								Set custom PFP emoji for each friend
							</span>
						</li>
						<li>
							<span className='checkbox'>◯</span>
							<span className='feature'>
								User ability to reset password
							</span>
						</li>
					</ul>
				</div>
				<div id='release'>
					<h3>Release</h3>
					<div className='tbd'>To be determined.</div>
				</div>
			</section> */}
		</div>
	);
};

export default Landing;
