import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

const MainNavigation = (props) => (
	<header className="main-nav">
		<div className="main-nav_logo">
			<h1>comm-man-sys</h1>
		</div>
		<div className="main-nav_items">
			<ul>
				<li>
					<NavLink to="/events">Events</NavLink>
				</li>
				<li>
					<NavLink to="/bookings">Bookings</NavLink>
				</li>
				<li>
					<NavLink to="/auth">Authentication</NavLink>
				</li>
			</ul>
		</div>
	</header>
);

export default MainNavigation;
