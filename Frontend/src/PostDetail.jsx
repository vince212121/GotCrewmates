import { Link } from "react-router-dom";

export const PostDetail = ({ match }) => {
  return (
    <div>
      <h1>This is the Post Detail page.</h1>
      <br/>
      <Link to="/">
      <button>Go Home</button>
      </Link>
    </div>
  );
};
