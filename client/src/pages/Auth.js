import React, { useState, useContext, setState, useRef } from "react";

import "./Auth.css";
import AuthContext from "../context/auth-context";

const AuthPage = () => {
	const [isLogin] = useState(true);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const context = useContext(AuthContext);

	const switchModeHandler = () => {
		setState((prevState) => {
			return { isLogin: !prevState.isLogin };
		});
	};

	const onSubmitHandler = (e) => {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) {
			return;
		}

		let requestBody = {
			query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
			variables: {
				email: email,
				password: password,
			},
		};

		if (!isLogin) {
			requestBody = {
				query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
				variables: {
					email: email,
					password: password,
				},
			};
		}

		fetch("http://localhost:5000/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Failed!");
				}
				return res.json();
			})
			.then((resData) => {
				if (resData.data.login.token) {
					context.login(
						resData.data.login.token,
						resData.data.login.userId,
						resData.data.login.tokenExpiration
					);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<form className="auth-form" onSubmit={onSubmitHandler}>
			<div className="form-control">
				<label htmlFor="email">E-Mail</label>
				<input type="email" id="email" ref={emailRef} />
			</div>
			<div className="form-control">
				<label htmlFor="password">Password</label>
				<input type="password" id="password" ref={passwordRef} />
			</div>
			<div className="form-actions">
				<button type="submit">Submit</button>
				<button type="button" onClick={switchModeHandler}>
					Switch to {isLogin ? "Signup" : "Login"}
				</button>
			</div>
		</form>
	);
};

export default AuthPage;