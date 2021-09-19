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

  const HomeSide = () => (
    <Link
      to="/"
      className="home bg-header text-3xl font-bold p-4 flex flex-row whitespace-nowrap"
    >
      <img src="/favicon-32x32.png" alt="Pepe" className="pepe-ico" />
      Got Crew Mates?
    </Link>
  );

  const UnAuthedComponent = () => (
    <div className="h-full flex rounded-t-xlflex-row items-center">
      <Link to="/login" className="text-2xl mr-4 p-1 bg-lightblue rounded-lg">
        Login
      </Link>
      <Link to="/signup" className="text-2xl mr-4 p-1 bg-lightblue rounded-lg">
        Sign Up
      </Link>
    </div>
  );

  const AuthedComponent = () => (
    <div className="h-full flex flex-row items-center mx-16">
      <BrowseTags />
      <div className="profile h-full flex items-center">
        <Link to={`/user/${username}`} className="text-2xl mx-4 p-1">
          {username}
        </Link>
        <div className="dropdown absolute hidden top-full right-16">
          <div className="flex flex-col">
            <Link to="/new-posting" className="bg-lightblue p-2 text-2xl">
              New Posting
            </Link>
            <button
              className="bg-lightblue p-2 text-2xl border-b-2 border-lightlightblue"
              onClick={() => {
                Cookies.remove("token");
                setToken(undefined);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="w-full bg-lightlightblue sticky">
        <div className="relative flex flex-row w-full">
          <HomeSide />
          <div className="absolute w-1/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <SearchBar />
          </div>
          <div className="h-max ml-auto float-left">
            {auth ? <AuthedComponent /> : <UnAuthedComponent />}
          </div>
        </div>
      </header>
      <style jsx>
        {`
          .profile:hover .dropdown {
            display: block;
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
