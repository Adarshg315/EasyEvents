const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config({ path: "./config/.env" });

const connectDB = require("./config/db");
connectDB();

const PORT = process.env.port || 7000;

app.listen(PORT, () => {
	console.log(`Server started at PORT ${PORT}`);
});
