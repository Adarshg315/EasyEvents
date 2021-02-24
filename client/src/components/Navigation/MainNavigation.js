import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./MainNavigation.css";

const MainNavigation = (props) => (
	<AuthContext.Consumer>
		{(context) => {
			return (
				<header className="main-nav">
					<div className="main-nav_logo">
						<h1>comansys</h1>
					</div>
					<nav className="main-nav_items">
						<ul>
							{!context.token && (
								<li>
									<NavLink to="/auth">Authenticate</NavLink>
								</li>
							)}
							<li>
								<NavLink to="/events">Events</NavLink>
							</li>
							{context.token && (
								<React.Fragment>
									<li>
										<NavLink to="/bookings">Bookings</NavLink>
									</li>
									<li>
										<button onClick={context.logout}>Logout</button>
									</li>
								</React.Fragment>
							)}
						</ul>
					</nav>
				</header>
			);
		}}
	</AuthContext.Consumer>
);

export default MainNavigation;
