import Axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../Constants";
import Cookies from "js-cookie";

const Posting = () => {
  const { id } = useParams();

  const [postingData, setPostingData] = useState({});

  useEffect(() => {
    setLoading(true);
    const token = Cookies.get("token");
    if (token) {
      Axios.get(BASE_URL + "/api/posting", {
        params: { postID: id },
        headers: { Authorization: `Bearer ${token}` },
      }).then((data) => {
        setPostingData(data);
        setLoading(false);
      });
    } else {
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
          <div>{postingData.body}</div>
          <div>{postingData.user}</div>
          <div>{postingData.numberOfSpots}</div>
        </>
      )}
    </>
  );
};

export default Posting;
