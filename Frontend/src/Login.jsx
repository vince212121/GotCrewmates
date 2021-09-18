import { Link, useHistory } from "react-router-dom";
import {useState} from "react";
import Axios from 'axios';

// To Do:
//
export const submitData = () => {};

export const Login = ({ match }) => {

  const history = useHistory();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [errorMessage,setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username,password);
    
    const response = await Axios.post('localhost:5000/api/session',{username : username, password : password } ,{headers: {"Access-Control-Allow-Origin": "*"}})
    if (response === 401) {
      
    }else if(response === 201){
      history.push("/");
    }
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
          <input type="text" placeholder="Username" name="username" onChange={({target:{value}})=>setUsername(value)} value={username}/>
          <input type="password" name="password" onChange={({target:{value}})=>setPassword(value)} value={password}/>
          {errorMessage}
          <input type="submit" value="Submit" />
      </form>
      
      <button>Submit</button>
    </div>
  );
};
