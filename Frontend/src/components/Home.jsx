import { Link } from "react-router-dom";
import Header from "react"



const Home = () => {
  return (
    <body class = "h-screen bg-background-200">
    <div className= "Header bg-header-500">
      <h1>GotCrewMates?</h1>
      Home Component
      </div>
      <ul>
        <li className = "object-none object-top-right">
          <Link to="/Login"> Login</Link>
        </li>
        <li>
          <Link to="/PostDetail">PostDetail</Link>
        </li>
        <li>
          <Link to="/Catalogue">Catalogue</Link>
        </li>
      </ul>
      </body>
  );
};


export default Home;