import Event from "../../models/event.mjs";
import Booking from "../../models/booking.mjs";
import { transformBooking, transformEvent } from "./merge.mjs";

const bookings = async (args, req) => {
	if (!req.isAuth) {
		throw new Error("Unauthenticated!");
	}
	try {
		const bookings = await Booking.find({ user: req.userId });
		return bookings.map((booking) => {
			return transformBooking(booking);
		});
	} catch (err) {
		throw err;
	}
};
const bookEvent = async (args, req) => {
	if (!req.isAuth) {
		throw new Error("Unauthenticated!");
	}
	const fetchedEvent = await Event.findOne({ _id: args.eventId });

	try {
		const bookings = await Booking.find({ user: req.userId });
		await bookings.map((booking) => {
			if (String(fetchedEvent._id) == String(booking.event))
				throw new Error("Event already booked!");
		});
	} catch (error) {
		throw err;
	}

	const booking = new Booking({
		user: req.userId,
		event: fetchedEvent,
	});
	const result = await booking.save();
	return transformBooking(result);
};
const cancelBooking = async (args, req) => {
	if (!req.isAuth) {
		throw new Error("Unauthenticated!");
	}
	try {
		const booking = await Booking.findById(args.bookingId).populate("event");
		const event = transformEvent(booking.event);
		await Booking.deleteOne({ _id: args.bookingId });
		return event;
	} catch (err) {
		throw err;
	}
};

export default { bookings, cancelBooking, bookEvent };
