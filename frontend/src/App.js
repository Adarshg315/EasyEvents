import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthComponent from "./components/Auth";
import BookingsComponent from "./components/Bookings";
import EventsComponent from "./components/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/AuthContext";

import "./App.css";

export default class App extends Component {
	state = {
		token: null,
		userId: null,
	};

	login = (token, userId, tokenExpiration) => {
		this.setState({ token: token, userId: userId });
	};

	logout = () => {
		this.setState({ token: null, userId: null });
	};

	render() {
		return (
			<BrowserRouter>
				<React.Fragment>
					<AuthContext.Provider
						value={{
							token: this.state.token,
							userId: this.state.userId,
							login: this.login,
							logout: this.logout,
						}}
					>
						<MainNavigation />
						<main className="main-content">
							<Switch>
								{this.state.token && <Redirect from="/" to="/events" exact />}
								{this.state.token && (
									<Redirect from="/auth" to="/events" exact />
								)}
								{!this.state.token && (
									<Route path="/auth" component={AuthComponent} />
								)}
								<Route path="/events" component={EventsComponent} />
								{this.state.token && (
									<Route path="/bookings" component={BookingsComponent} />
								)}
								{!this.state.token && <Redirect to="/auth" exact />}
							</Switch>
						</main>
					</AuthContext.Provider>
				</React.Fragment>
			</BrowserRouter>
		);
	}
}
