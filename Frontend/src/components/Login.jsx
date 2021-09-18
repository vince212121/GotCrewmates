import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";

// To Do:
//
export const submitData = () => {};

export const Login = ({ match }) => {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);

    Axios.post("http://52.170.70.22:5000/api/session", {
      username: username,
      password: password,
    })
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        setErrorMessage("Login Failed");
      });
  };

  return (
    <div className="w-full items-center bg-gray-400">
      <Link to="/">
        <button>Go Home</button>
      </Link>
      <h1 className="text-4xl">This is the Log in page.</h1>
      <form
        className=" object-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
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
          {errorMessage}
          <input type="submit" value="Submit" />
        </div>
      </form>

      <button>Submit</button>
    </div>
  );
};
