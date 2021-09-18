import { Link } from "react-router-dom";

export const Catalogue = ({ match }) => {
  return (
    <div>
      <h1>This is the Catalogue page.</h1>
      <br/>
      <Link to="/">
      <button>Go Home</button>
      </Link>
    </div>
  );
};
