import { Link } from "react-router-dom";
import {View} from "react"

// To Do:
//
export const Login = ({ match }) => {

  const accountLogin = () =>{};

  return (
    <div className="w-full items-center bg-gray-400">
    <h1 className="text-4xl">This is the Log in page.</h1>
        <form className="flex flex-col" onSubmit = {accountLogin}>
          <input type="text" name="username"/>
            {/* <input>
            type = "text"
            placeholder = "AMOGUS"
            value = {account}/> */}
                 </form>
        <Link to="/">
          <button>Go Home</button>
        </Link>
        </ div>
  );
};
