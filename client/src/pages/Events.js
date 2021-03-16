import React, {
	useRef,
	useState,
	useContext,
	useEffect,
	Fragment,
} from "react";
import "./Events.css";
import {
	FormGroup,
	TextField,
	Backdrop,
	FormControl,
	InputLabel,
	OutlinedInput,
	Paper,
	Button,
} from "@material-ui/core";
import Modal from "../components/Modal/Modal";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/AuthContext";
import useEventStyles from "./EventStyles";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const EventsPage = () => {
	const [creating, setCreating] = useState(false);
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const classes = useEventStyles();

	var isActive = true;
	const eventContext = useContext(AuthContext);

	const titleElRef = useRef(null);
	const priceElRef = useRef(null);
	const dateElRef = useRef(null);
	const descriptionElRef = useRef(null);

	useEffect(() => {
		fetchEvents();
		return () => {
			isActive = false;
		};
	}, []);

	const modalConfirmHandler = () => {
		setCreating(false);

		const title = titleElRef.current.value;
		const price = +priceElRef.current.value;
		const date = dateElRef.current.value;
		const description = descriptionElRef.current.value;

		if (
			title.trim().length === 0 ||
			price <= 0 ||
			date.trim().length === 0 ||
			description.trim().length === 0
		) {
			return;
		}

		const event = { title, price, date, description };
		console.log(event);

		const requestBody = {
			query: `
          mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
			variables: {
				title: title,
				desc: description,
				price: price,
				date: date,
			},
		};

		const token = eventContext.token;

		fetch("https://comm-man-backend.herokuapp.com/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Failed!");
				}
				return res.json();
			})
			.then((resData) => {
				setEvents(() => {
					const updatedEvents = [...events];
					updatedEvents.push({
						_id: resData.data.createEvent._id,
						title: resData.data.createEvent.title,
						description: resData.data.createEvent.description,
						date: resData.data.createEvent.date,
						price: resData.data.createEvent.price,
						creator: {
							_id: eventContext.userId,
						},
					});
					return updatedEvents;
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const modalCancelHandler = () => {
		setCreating(false);
		setSelectedEvent(null);
	};

	const fetchEvents = () => {
		setIsLoading(true);
		const requestBody = {
			query: `
          query {
            events {
              _id
              title
              description
              date
              price
			  creator {
				_id
				email
			  }
            }
          }
        `,
		};

		fetch("https://comm-man-backend.herokuapp.com/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Failed!");
				}
				return res.json();
			})
			.then((resData) => {
				const events = resData.data.events;
				if (isActive) {
					setEvents(events);
					setIsLoading(false);
				}
			})
			.catch((err) => {
				console.log(err);
				if (isActive) {
					setIsLoading(false);
				}
			});
	};

	const showDetailHandler = (eventId) => {
		setSelectedEvent(events.find((e) => e._id === eventId));
	};

	const bookEventHandler = () => {
		if (!eventContext.token) {
			setSelectedEvent(null);
			return;
		}
		console.log(selectedEvent);
		const requestBody = {
			query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
			variables: {
				id: selectedEvent._id,
			},
		};

		fetch("https://comm-man-backend.herokuapp.com/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + eventContext.token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Failed!");
				}
				return res.json();
			})
			.then((resData) => {
				console.log(resData);
				setSelectedEvent(null);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Fragment>
			{(creating || selectedEvent) && <Backdrop />}
			{creating && (
				<Modal
					className={classes.modal}
					title="Add Event"
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={modalConfirmHandler}
					confirmText="Confirm"
					closeAfterTransition
					BackdropComponent={Backdrop}
					BackdropProps={{
						timeout: 500,
					}}
				>
					<FormGroup className={classes.root} noValidate autoComplete="off">
						<FormControl variant="outlined">
							<InputLabel htmlFor="title">Title</InputLabel>
							<OutlinedInput id="title" label="title" inputRef={titleElRef} />
						</FormControl>

						<FormControl variant="outlined">
							<InputLabel htmlFor="price">Price</InputLabel>
							<OutlinedInput
								id="price"
								label="price"
								inputRef={priceElRef}
								type="number"
							/>
						</FormControl>

						<FormControl variant="outlined">
							<TextField
								id="description"
								label="Description"
								multiline
								rows={4}
								variant="outlined"
								inputRef={descriptionElRef}
							/>
						</FormControl>

						<FormControl variant="outlined">
							{/* <InputLabel htmlFor="date">Date</InputLabel> */}
							<TextField
								id="date"
								variant="outlined"
								// label="date"
								inputRef={dateElRef}
								type="datetime-local"
								label="Date"
								// defaultValue="2017-05-24T10:30"
								className={classes.textField}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</FormControl>
					</FormGroup>
				</Modal>
			)}
			{selectedEvent && (
				<Modal
					title={selectedEvent.title}
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={bookEventHandler}
					confirmText={eventContext.token ? "Book" : "Confirm"}
				>
					<h1>{selectedEvent.title}</h1>
					<h2>
						${selectedEvent.price} -{" "}
						{new Date(selectedEvent.date).toLocaleDateString()}
					</h2>
					<p>{selectedEvent.description}</p>
				</Modal>
			)}
			{eventContext.token && (
				<div className={classes.root}>
					<Paper elevation={6}>
						<Button
							variant="contained"
							color="primary"
							className={classes.button}
							startIcon={<AddCircleIcon />}
							onClick={() => setCreating(true)}
						>
							Create Events
						</Button>
					</Paper>
				</div>
			)}
			{isLoading ? (
				<Spinner />
			) : (
				<EventList
					events={events}
					authUserId={eventContext.userId}
					onViewDetail={showDetailHandler}
				/>
			)}
		</Fragment>
	);
};

export default EventsPage;
