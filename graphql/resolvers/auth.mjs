import pkg from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/user.mjs";

const { hash, compare } = pkg;

const createUser = async (args) => {
	try {
		//existing user
		const existingUser = await User.findOne({ email: args.userInput.email });
		if (existingUser) {
			throw new Error("User exists already.");
		}
		//hashing password
		const hashedPassword = await hash(args.userInput.password, 12);

		//creating new user
		const user = new User({
			email: args.userInput.email,
			password: hashedPassword,
		});

		//saving user to database
		const result = await user.save();
		return { ...result._doc, password: null, _id: result.id };
	} catch (err) {
		throw err;
	}
};

const login = async ({ email, password }) => {
	const user = await User.findOne({ email: email });
	if (!user) {
		throw new Error("User does not exist!");
	}
	const isEqual = await compare(password, user.password);

	if (!isEqual) {
		throw new Error("Incorrect Password from Backend!");
	}
	const token = jsonwebtoken.sign(
		{ userId: user.id, email: user.email },
		"somesupersecretkey",
		{
			expiresIn: "1h",
		}
	);
	return { userId: user.id, token: token, tokenExpiration: 1 };
};

export default { login, createUser };
