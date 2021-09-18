import { Link } from "react-router-dom";

export const Home = ({ match }) => {
  return (
    <div>
      Home Component
      <ul>
        <li>
          <Link to="/Login"> Login</Link>
        </li>
        <li>
          <Link to="/PostDetail">PostDetail</Link>
        </li>
        <li>
          <Link to="/Catalogue">Catalogue</Link>
        </li>
      </ul>
    </div>
  );
};
