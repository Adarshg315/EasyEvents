import React, { Fragment, useState, useEffect, useContext } from "react";

import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/AuthContext";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControls from "../components/Bookings/BookingsControls/BookingsControls";

const BookingsPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [bookings, setBookings] = useState([]);
	const [outputType, setOutputType] = useState("list");

	const context = useContext(AuthContext);

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = () => {
		setIsLoading(true);
		const requestBody = {
			query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
               price
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
				const bookings = resData.data.bookings;
				setBookings(bookings);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const deleteBookingHandler = (bookingId) => {
		setIsLoading(true);
		const requestBody = {
			query: `
          mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
			variables: {
				id: bookingId,
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
				setBookings(() => {
					const updatedBookings = bookings.filter((booking) => {
						return booking._id !== bookingId;
					});
					setIsLoading(false);
					return setBookings(updatedBookings);
				});
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const changeOutputTypeHandler = (outputType) => {
		if (outputType === "list") {
			setOutputType("list");
		} else {
			setOutputType("chart");
		}
	};

	let content = <Spinner />;
	if (!isLoading) {
		content = (
			<Fragment>
				<BookingsControls
					activeOutputType={outputType}
					onChange={changeOutputTypeHandler}
				/>
				<div>
					{outputType === "list" ? (
						<BookingList bookings={bookings} onDelete={deleteBookingHandler} />
					) : (
						<BookingsChart bookings={bookings} />
					)}
				</div>
			</Fragment>
		);
	}
	return <Fragment>{content}</Fragment>;
};
export default BookingsPage;
