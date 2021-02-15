const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const events = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		events.map((event) => {
			return {
				...event._doc,
				date: new Date(event._doc.date).toISOString(),
				creator: user.bind(this, event.creator),
			};
		});
		return events;
	} catch (err) {
		throw err;
	}
};

const user = (uesrId) => {
	return User.findById(uesrId)
		.then((user) => {
			return {
				...user._doc,
				createdEvents: events.bind(this, user._doc.createdEvents),
			};
		})
		.catch((err) => {
			throw err;
		});
};

module.exports = {
	events: () => {
		return Event.find()
			.then((events) => {
				return events.map((event) => {
					return {
						...event._doc,
						date: new Date(event._doc.date).toISOString(),
						creator: user.bind(this, event._doc.creator),
					};
				});
			})
			.catch((err) => {
				throw err;
			});
	},
	createEvent: (args) => {
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			date: new Date(args.eventInput.date),
			creator: "602a1c1225477622dcc470e4",
		});
		let createdEvent;
		return event
			.save()
			.then((result) => {
				createdEvent = {
					...result._doc,
					date: new Date(event._doc.date).toISOString(),
					creator: user.bind(this, result._doc.creator),
				};
				return User.findById("602a1c1225477622dcc470e4");
			})
			.then((user) => {
				if (!user) {
					throw new Error("user not found");
				}
				user.createdEvents.push(event);
				return user.save();
			})
			.then((result) => {
				return createdEvent;
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
	},
	createUser: (args) => {
		return User.findOne({ email: args.userInput.email })
			.then((user) => {
				if (user) {
					throw new Error("user exists");
				}
				return bcrypt.hash(args.userInput.password, 12);
			})
			.then((hashedPassword) => {
				const user = new User({
					email: args.userInput.email,
					password: hashedPassword,
				});
				return user.save();
			})
			.then((result) => {
				return { ...result._doc, password: null };
			});
	},
};
