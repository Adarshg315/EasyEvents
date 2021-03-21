import mongoose from "mongoose";
const { Schema, model } = mongoose;

const eventSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	category: {
		type: String,
	},
});

export default model("Event", eventSchema);
