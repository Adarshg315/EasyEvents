import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export default model("Booking", bookingSchema);
