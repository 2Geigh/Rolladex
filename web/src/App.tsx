import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Logout from './pages/Logout/Logout';
import { useState } from 'react';
import {
	GetSessionAndUserData,
	LoginSessionContext,
} from './contexts/LoginSession';
import Login from './pages/Login/Login';
import SignUp from './pages/Signup/Signup';
import Friends from './pages/Friends/Friends';
import FriendStandalonePage from './pages/Friends/FriendStandalonePage';
import Loading from './components/Loading/Loading';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import InteractionStandalonePage from './pages/Interactions/InteractionStandalonePage';
import Settings from './pages/Settings/Settings';
import type { LoginSessionData } from './contexts/LoginSession';
import AddFriends from './pages/AddFriends/AddFriends';
import Profile from './pages/Profile/Profile';
import { useLayoutEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import '../public/styles/app.scss';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import HttpErrorWithoutHeaderAndFooter from './components/Error/ErrorWithoutHeaderAndFooter';
import Landing from './pages/Landing/Landing';

function App() {
	const [loginSessionData, setLoginSessionData] = useState<LoginSessionData>({
		isLoggedIn: false,
		user: undefined,
		csrfToken: undefined,
	});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const LoginSessionContextValue = {
		...loginSessionData,
		updateSession: setLoginSessionData,
	};

	useLayoutEffect(() => {
		GetSessionAndUserData(loginSessionData, setLoginSessionData)
			.catch((err) => {
				if (err instanceof Error) {
					console.error(`session check failed: ${err}`);
				}
			})
			.finally(() => setIsLoading(false));
	}, []); // Runs only once on app mount

	if (isLoading) {
		return (
			<>
				<Navbar
					isLoggedIn={loginSessionData.isLoggedIn}
					username={loginSessionData.user?.username}
				/>
				<Loading />
				<Footer />
			</>
		);
	}

	return (
		<>
			<LoginSessionContext.Provider value={LoginSessionContextValue}>
				<Navbar
					isLoggedIn={LoginSessionContextValue.isLoggedIn}
					username={LoginSessionContextValue.user?.username}
				/>
				<div id='bodyAndFooter'>
					<Routes>
						<Route path='/' element={<Landing />} />

						<Route path='/login' element={<Login />} />
						<Route path='/logout' element={<Logout />} />
						<Route path='/signup' element={<SignUp />} />

						<Route
							path='/terms_of_service'
							element={<TermsOfService />}
						/>

						<Route
							path='/privacy_policy'
							element={<PrivacyPolicy />}
						/>

						<Route element={<ProtectedRoutes />}>
							<Route
								path='/home'
								element={
									<Home
										loginSessionContext={loginSessionData}
									/>
								}
							/>
							<Route path='/friends' element={<Friends />} />
							<Route
								path='/friends/:friendId'
								element={<FriendStandalonePage />}
							/>
							<Route
								path='/interactions/:interactionId'
								element={<InteractionStandalonePage />}
							/>
							<Route path='/addfriend' element={<AddFriends />} />
							<Route path='/profile' element={<Profile />} />
							<Route path='/settings' element={<Settings />} />
						</Route>

						<Route
							path='*'
							element={
								<HttpErrorWithoutHeaderAndFooter
									errorCode={404}
									errorMessage='Page not found'
								/>
							}
						></Route>
					</Routes>
					<Footer />
				</div>
			</LoginSessionContext.Provider>
		</>
	);
}

export default App;
