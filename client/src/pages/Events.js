import React, {
	useRef,
	useState,
	useContext,
	useEffect,
	Fragment,
} from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/AuthContext";
import "./Events.css";

const EventsPage = () => {
	const [creating, setCreating] = useState(false);
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	var isActive = true;

	const context = useContext(AuthContext);

	const titleElRef = useRef(null);
	const priceElRef = useRef(null);
	const dateElRef = useRef(null);
	const descriptionElRef = useRef(null);

	//componentDidMount and componentWillUnmount equivalent
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

		const token = context.token;

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
							_id: context.userId,
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
		if (!context.token) {
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
				Authorization: "Bearer " + context.token,
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
					title="Add Event"
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={modalConfirmHandler}
					confirmText="Confirm"
				>
					<form>
						<div className="form-control">
							<label htmlFor="title">Title</label>
							<input type="text" id="title" ref={titleElRef} />
						</div>
						<div className="form-control">
							<label htmlFor="price">Price</label>
							<input type="number" id="price" ref={priceElRef} />
						</div>
						<div className="form-control">
							<label htmlFor="date">Date</label>
							<input type="datetime-local" id="date" ref={dateElRef} />
						</div>
						<div className="form-control">
							<label htmlFor="description">Description</label>
							<textarea id="description" rows="4" ref={descriptionElRef} />
						</div>
					</form>
				</Modal>
			)}
			{selectedEvent && (
				<Modal
					title={selectedEvent.title}
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={bookEventHandler}
					confirmText={context.token ? "Book" : "Confirm"}
				>
					<h1>{selectedEvent.title}</h1>
					<h2>
						${selectedEvent.price} -{" "}
						{new Date(selectedEvent.date).toLocaleDateString()}
					</h2>
					<p>{selectedEvent.description}</p>
				</Modal>
			)}
			{context.token && (
				<div className="events-control">
					<p>Share your own Events!</p>
					<button className="btn" onClick={() => setCreating(true)}>
						Create Event
					</button>
				</div>
			)}
			{isLoading ? (
				<Spinner />
			) : (
				<EventList
					events={events}
					authUserId={context.userId}
					onViewDetail={showDetailHandler}
				/>
			)}
		</Fragment>
	);
};

export default EventsPage;
