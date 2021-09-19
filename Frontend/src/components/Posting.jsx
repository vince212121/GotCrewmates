import Axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import { BASE_URL } from "../Constants";
import Cookies from "js-cookie";
import Loading from "./Loading";
import Tag from "./Tag";
import JoinButton from "./JoinButton";

const Posting = () => {
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState({});

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      Axios.get(BASE_URL + "/api/posting", {
        params: { postID: id },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => {
          setPosting(data.data[0]);
          setLoading(false);
        })
        .catch((e) => {
          if (e.response.status === 401) {
            history.push(`/login?redirect=${location.pathname}`);
          }
        });
    } else {
      history.push(`/login?redirect=${location.pathname}`);
    }
  }, [id, history, location.pathname]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Link
            to={`/posting/${posting.postid}`}
            className="text-4xl text-white mb-4 border-b-2"
          >
            {posting.title}
          </Link>
          <div className="text-white border border-black rounded-xl p-4">
            {posting.postbody}
            <div className="flex flex-row gap-x-2">
              {posting.tagname.map((tag) => (
                <Tag name={tag} key={tag} />
                ))}
            </div>
          </div>
          <div>{posting.creator}</div>
          <div>{posting.numberofspots}</div>
          <JoinButton post = {posting}/>
        </>
      )}
    </>
  );
};

export default Posting;
