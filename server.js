require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const isAuth = require("./middleware/is-auth");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const path = require("path");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "client", "build")));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

app.use(isAuth);

app.use(
	"/graphql",
	graphqlHTTP({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
		graphiql: true,
	})
);
const PORT = process.env.port || 7000;

const connectDB = require("./config/db.config");
connectDB();

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname + "client", "build", "index.html"));
});

app.listen(PORT, () => {
	console.log(`Server started at PORT ${PORT}`);
});
