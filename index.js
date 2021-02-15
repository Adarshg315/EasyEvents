require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const db = require("./models/user");
const app = express();
const Event = require("./models/event");
const User = require("./models/user.js");
const bcrypt = require("bcryptjs");
app.use(bodyParser.json());

app.use(
	"/graphql",
	graphqlHTTP({
		schema: buildSchema(`
			type Event{
				_id: ID!
				title: String!
				description: String!
				date: String!

			}

			type User{
				_id: ID!
				email: String!
				password: String
			}

			input EventInput{
				title: String!
				description: String!
				date: String!
			}

			input UserInput{
				email: String!
				password: String!
			}
			type RootQuery{
				events: [Event!]!

			}

			type RootMutation{
				createEvent(eventInput: EventInput): Event
				createUser(userInput: UserInput): User
			}

			schema {
				query:RootQuery
				mutation:RootMutation
			}
		`),
		rootValue: {
			events: () => {
				return Event.find()
					.then((events) => {
						return events.map((event) => {
							return { ...event._doc };
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
						createdEvent = { ...result._doc };
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
					})
					.catch((err) => {
						throw err;
					});
			},
		},
		graphiql: true,
	})
);
const PORT = process.env.port || 7000;

const connectDB = require("./config/db.config");
const user = require("./models/user");
connectDB();

app.listen(PORT, () => {
	console.log(`Server started at PORT ${PORT}`);
});
