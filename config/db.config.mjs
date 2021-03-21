import mongoose from "mongoose";
// import MongoClient from "mongodb";
// const client = new MongoClient(process.env.ATLAS_URI, {
// 	useUnifiedTopology: true,
// });

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.ATLAS_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected");
		// await client.connect();
		// collection = client.db("events-db").collection("events");
		// collection2 = client.db("events-db").collection("users");
	} catch (err) {
		console.log(err.message);
		process.exit(1);
	}
};

export default connectDB;
