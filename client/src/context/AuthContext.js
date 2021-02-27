import { createContext } from "react";

const AuthContext = createContext({
	token: null,
	userId: null,
	login: () => {},
	logout: () => {},
});

export default AuthContext;
