import { Link } from 'react-router-dom';
import './Landing.scss';

const Landing = () => {
	return (
		<div id='landingContainer'>
			<header className='hero'>
				<div className='hero-content'>
					<h1>Maintain Your IRL Network.</h1>
					<p>
						Track your social relationships, log critical dates, and
						counter connection decay with outreach reminders.
					</p>
					<div className='cta-buttons'>
						<Link to='/home' className='cta-button' id='toApp'>
							Open App
						</Link>
						<Link
							to={`https://github.com/2geigh/rolladex`}
							className='cta-button'
							id='github'
						>
							Github
						</Link>
					</div>
				</div>
			</header>

			<section className='features'>
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
			</section>
		</div>
	);
};

export default Landing;
