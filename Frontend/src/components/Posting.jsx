import Axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { BASE_URL } from "../Constants";
import Cookies from "js-cookie";
import Loading from "./Loading";

const Posting = () => {
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [postingData, setPostingData] = useState({});

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      Axios.get(BASE_URL + "/api/posting", {
        params: { postID: id },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => {
          setPostingData(data.data[0]);
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
          <h1 className="text-4xl text-white mb-4 border-b-2">
            {postingData.title}
          </h1>
          <div className="text-white border border-black rounded-xl p-4">
            {postingData.postbody}
          </div>
          <div>{postingData.creator}</div>
          <div>{postingData.numberofspots}</div>
        </>
      )}
    </>
  );
};

export default Posting;
