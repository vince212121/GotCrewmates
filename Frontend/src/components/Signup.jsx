import { useHistory } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import { BASE_URL } from "../Constants";

const Signup = () => {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordMatch) setErrorMessage("Passwords do not match.");
    Axios.post(BASE_URL + "/api/user", {
      username: username,
      password: password,
    })
      .then((res) => {
        history.push({ pathname: "/login", search: "?new-account=true" });
      })
      .catch((err) => {
        if (err.status === 401) setErrorMessage("Username already exists");
        if (err.status >= 500 && err.status < 600)
          setErrorMessage("Internal server error");
      });
  };

  return (
    <>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={({ target: { value } }) => setUsername(value)}
          value={username}
        />
        <input
          type="password"
          name="password"
          onChange={({ target: { value } }) => setPassword(value)}
          value={password}
        />
        <input
          type="password"
          name="passwordMatch"
          onChange={({ target: { value } }) => setPasswordMatch(value)}
          value={passwordMatch}
        />
        {errorMessage}
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Signup;
