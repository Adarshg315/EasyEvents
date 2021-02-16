const Event = require("../../models/event");

const { transformEvent } = require("./merge");

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => {
				return transformEvent(event);
			});
		} catch (err) {
			throw err;
		}
	},
	createEvent: async (args) => {
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			date: new Date(args.eventInput.date),
			creator: "602a1c1225477622dcc470e4",
		});
		let createdEvent;
		try {
			const result = await event.save();
			createdEvent = transformEvent(result);
			const creator = await User.findById("602a1c1225477622dcc470e4");

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
	},
};
