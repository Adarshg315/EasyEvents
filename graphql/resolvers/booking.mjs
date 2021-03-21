import Event from "../../models/event.mjs";
import Booking from "../../models/booking.mjs";
import { transformBooking, transformEvent } from "./merge.mjs";

async function bookings(args, req) {
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
}
async function bookEvent(args, req) {
	if (!req.isAuth) {
		throw new Error("Unauthenticated!");
	}
	const fetchedEvent = await Event.findOne({ _id: args.eventId });
	const booking = new Booking({
		user: req.userId,
		event: fetchedEvent,
	});
	const result = await booking.save();
	return transformBooking(result);
}
async function cancelBooking(args, req) {
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
}

export default { bookings, cancelBooking, bookEvent };
