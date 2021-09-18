import { Link, useHistory } from "react-router-dom";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Header = () => {
  const history = useHistory();

  const [token, setToken] = useState();
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setToken(Cookies.get("token"));
    history.listen(() => {
      setToken(Cookies.get("token"));
    });
  }, []);

  useEffect(() => {
    if (token) {
      const { username } = jwt.decode(token);
      if (username) {
        setUsername(username);
        setAuth(true);
      } else {
        setAuth(false);
      }
    } else {
      setAuth(false);
    }
  }, [token]);

  return (
    <>
      <header className="w-full flex flex-row bg-lightlightblue p-4 sticky">
        <Link
          to="/"
          className="bg-header text-3xl font-bold pl-2 flex flex-row"
        >
          <img src="/favicon-32x32.png" alt="Pepe" />
          Got Crew Mates?
        </Link>
        <div className="ml-auto float-left">
          {auth ? (
            <div className="profile h-max">
              <Link to={`/user/${username}`} className="text-2xl mr-4 p-1">
                {username}
              </Link>
              <div className="dropdown absolute hidden pt-4 float-right">
                <button
                  className="bg-lightblue mr-4 mt-1 p-2 text-2xl"
                  onClick={() => {
                    Cookies.remove("token");
                    setToken(undefined);
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-2xl mr-4 p-1 bg-lightblue rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-2xl mr-4 p-1 bg-lightblue rounded-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>
      <style jsx>
        {`
          .profile:hover .dropdown {
            display: block;
            left: auto;
            right: 0;
          }
        `}
      </style>
    </>
  );
};

export default Header;
