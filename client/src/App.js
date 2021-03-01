import React, { useState, Fragment, useEffect } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/AuthContext";

import "./App.css";

const App = () => {
	const [token, setToken] = useState(null);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		const loggedInUserId = sessionStorage.getItem("userId");
		const loggedInUserToken = sessionStorage.getItem("token");
		if (loggedInUserId && loggedInUserToken) {
			setUserId(loggedInUserId);
			setToken(loggedInUserToken);
		}
	}, []);

	const login = (token, userId) => {
		setUserId(userId);
		setToken(token);
		sessionStorage.setItem("userId", userId);
		sessionStorage.setItem("token", token);
		console.log("logged in");
	};

	const logout = () => {
		setToken(null);
		setUserId(null);
		sessionStorage.clear();
		console.log("logged out");
	};

	return (
		<BrowserRouter>
			<Fragment>
				<AuthContext.Provider
					value={{
						token,
						userId,
						login,
						logout,
					}}
				>
					<MainNavigation />
					<main className="main-content">
						<Switch>
							{token && <Redirect from="/" to="/events" exact />}
							{token && <Redirect from="/auth" to="/events" exact />}
							{!token && <Route path="/auth" component={AuthPage} />}
							<Route path="/events" component={EventsPage} />
							{token && <Route path="/bookings" component={BookingsPage} />}
							{!token && <Redirect to="/auth" exact />}
						</Switch>
					</main>
				</AuthContext.Provider>
			</Fragment>
		</BrowserRouter>
	);
};

export default App;
