import { useHistory, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import Axios from "axios";
import { BASE_URL } from "../Constants";
import Cookies from "js-cookie";

const Login = () => {
  const { search } = useLocation();
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const redirect = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("redirect");
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    Axios.post(BASE_URL + "/api/session", {
      username: username,
      password: password,
    })
      .then((res) => {
        const expireDate = new Date(
          new Date().getTime() + parseInt(res.data.maxAge)
        );
        Cookies.remove("token");
        Cookies.set("token", res.data.token, { expires: expireDate });
        if (redirect) history.push(redirect);
        else history.push("/");
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Login Failed");
      });
  };

  return (
    <div className="w-full items-center bg-gray-400">
      <h1 className="text-2xl text-white mb-3">Login</h1>
      <form
        className=" object-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="username"
            name="username"
            onChange={({ target: { value } }) => setUsername(value)}
            value={username}
            className="mb-3"
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={({ target: { value } }) => setPassword(value)}
            value={password}
            className="mb-3"
          />
          {errorMessage}
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default Login;
