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
      <h1 className="text-2xl text-white mb-3">Signup</h1>
      <form className=" object-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={({ target: { value } }) => setUsername(value)}
          value={username}
          className="mb-2"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={({ target: { value } }) => setPassword(value)}
          value={password}
          className="mb-2"
        />
        <input
          type="password"
          placeholder="re-enter password"
          name="passwordMatch"
          onChange={({ target: { value } }) => setPasswordMatch(value)}
          value={passwordMatch}
          className="mb-2"
        />
        {errorMessage}
        <input type="submit"/>
        </div>
      </form>
    </>
  );
};

export default Signup;
