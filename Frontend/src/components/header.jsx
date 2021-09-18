import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full flex flex-row bg-lightlightblue p-4 sticky">
      <Link to="/" className="bg-header text-3xl font-bold pl-2 flex flex-row w-1/4">
        <img src="/favicon-32x32.png" alt="Pepe" />
        Got Crew Mates?
      </Link>
      <Link to="/login" className="text-2xl ml-auto mr-4 p-1 bg-lightblue rounded-lg">
        Login
      </Link>
      <Link to="/signup" className="text-2xl mr-4 p-1 bg-lightblue rounded-lg">
        Sign Up
      </Link>
    </header>
  );
};

export default Header;
