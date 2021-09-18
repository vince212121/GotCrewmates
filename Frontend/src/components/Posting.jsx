import Axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { BASE_URL } from "../Constants";
import Cookies from "js-cookie";

const Posting = () => {
  const history = useHistory();
  const location = useLocation();
  console.log(location);
  const { id } = useParams();

  const [postingData, setPostingData] = useState({});

  useEffect(() => {
    console.log("On Load");
    const token = Cookies.get("token");
    console.log(token);
    if (token) {
      Axios.get(BASE_URL + "/api/posting", {
        params: { postID: id },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => {
          console.log("OK");
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
  }, [id]);

  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h1>{postingData.title}</h1>
          <div>{postingData.postbody}</div>
          <div>{postingData.creator}</div>
          <div>{postingData.numberofspots}</div>
        </>
      )}
    </>
  );
};

export default Posting;
