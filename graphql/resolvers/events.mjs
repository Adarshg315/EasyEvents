import Event from "../../models/event.mjs";
import User from "../../models/user.mjs";
import { transformEvent } from "./merge.mjs";

async function events() {
	try {
		const events = await Event.find();
		return events.map((event) => {
			return transformEvent(event);
		});
	} catch (err) {
		throw err;
	}
}
async function createEvent(args, req) {
	if (!req.isAuth) {
		throw new Error("Unauthenticated!");
	}
	const event = new Event({
		title: args.eventInput.title,
		description: args.eventInput.description,
		price: +args.eventInput.price,
		date: new Date(args.eventInput.date),
		creator: req.userId,
	});
	let createdEvent;
	try {
		const result = await event.save();
		createdEvent = transformEvent(result);
		const creator = await User.findById(req.userId);

		if (!creator) {
			throw new Error("User not found.");
		}
		creator.createdEvents.push(event);
		await creator.save();

		return createdEvent;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

export default { createEvent, events };
