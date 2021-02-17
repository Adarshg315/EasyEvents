require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
// const db = require("./models/user");
const app = express();
const isAuth = require("./middleware/is-auth");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

app.use(bodyParser.json());

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

app.listen(PORT, () => {
	console.log(`Server started at PORT ${PORT}`);
});
