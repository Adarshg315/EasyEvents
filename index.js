const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require("./models/member.model");

require("dotenv").config({ path: "./config/.env" });

const connectDB = require("./config/db.config");
connectDB();

const PORT = process.env.port || 7000;

// app.get(endpoint, callback)

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post("/addMembers", (req, res) => {
	membersCollection
		.insertOne(req.body)
		.then((result) => {
			console.log(result);
		})
		.catch((error) => console.error(error));
});

app.listen(PORT, () => {
	console.log(`Server started at PORT ${PORT}`);
});
