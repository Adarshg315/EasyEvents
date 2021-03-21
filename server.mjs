import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import express from "express";
import { graphqlHTTP } from "express-graphql";
import graphQlSchema from "./graphql/schema/index.mjs";
import graphQlResolvers from "./graphql/resolvers/index.mjs";
import { resolve } from "path";
import isAuth from "./middleware/is-auth.mjs";
import cors from "cors";
import {
	autoComplete,
	getAutoCompleteData,
} from "./autocomplete/autocomplete.mjs";

const app = express();

const port = process.env.PORT || 5000;
import connectDB from "./config/db.config.mjs";
connectDB();

app.use(express.json());
app.use(cors());
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

//for production
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build/"));
	app.get("*", (req, res) => {
		res.sendFile(resolve(__dirname, "client", "build", "index.html"));
	});
}

//autoComplete
app.get("/search", autoComplete);
app.get("/get/:id", getAutoCompleteData);

app.listen(port, () => {
	console.log(`server started at port ${port}`);
});
