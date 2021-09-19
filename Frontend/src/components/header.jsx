import { Link, useHistory } from "react-router-dom";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import BrowseTags from "./Browse";
import SearchBar from "./searchBar";

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
      <header className="w-full flex flex-row bg-lightlightblue sticky">
        <Link
          to="/"
          className="home bg-header text-3xl font-bold pl-2 flex flex-row whitespace-nowrap"
        >
          <img src="/favicon-32x32.png" alt="Pepe" className="pepe-ico" />
          Got Crew Mates?
        </Link>
        <div className="float-left">
          <SearchBar />
        </div>
        <div className="h-full ml-auto float-left top-0">
          {auth ? (
            <div className="h-max flex flex-row">
              <BrowseTags />
              <div className="profile">
                <Link to={`/user/${username}`} className="text-2xl mr-4 p-1">
                  {username}
                </Link>
                <div className="dropdown absolute hidden float-right">
                  <div className="flex flex-col">
                    <button
                      className="bg-lightblue mr-4 p-2 text-2xl"
                      onClick={() => {
                        Cookies.remove("token");
                        setToken(undefined);
                      }}
                    >
                      Logout
                    </button>
                    <Link to="/new-posting">New Posting</Link>
                  </div>
                </div>
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
            top: 90%;
            right: 0px;
          }

          .home:hover .pepe-ico {
            animation-name: spin;
            animation-duration: 5000ms;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }
        `}
      </style>
    </>
  );
};

export default Header;
