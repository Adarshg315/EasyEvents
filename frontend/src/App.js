import { React } from "react";
import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AuthComponent from "./components/Auth";
import BookingsComponent from "./components/Bookings";
import EventComponent from "./components/Event";
import MainNavigation from "./components/Navigation/MainNavigation";

const App = () => {
	return (
		<BrowserRouter>
			{/* <React.Fragment> */}
			<MainNavigation />
			<main className="main-component">
				<Switch>
					<Redirect from="/" to="/auth" exact></Redirect>
					<Route path="/auth" component={AuthComponent}></Route>
					<Route path="/events" component={EventComponent}></Route>
					<Route path="/bookings" component={BookingsComponent}></Route>
				</Switch>
			</main>
			{/* </React.Fragment> */}
		</BrowserRouter>
	);
};

export default App;
