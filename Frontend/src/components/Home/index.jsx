import Axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import { BASE_URL } from "../../Constants";
import Cookies from "js-cookie";
import Loading from "../Loading";
import SmallPosting from "./SmallPosting";

const Home = () => {
  const history = useHistory();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [postingData, setPostingData] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      Axios.get(BASE_URL + "/api/posting", {
        params: { pageNumber: pageNumber },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => {
          console.log(data.data);
          setPostingData(data.data);
          setLoading(false);
        })
        .catch((e) => {
          if (e.response.status === 401) {
            history.push("/login");
          }
        });
    } else {
      history.push("/login");
    }
  }, [id, history]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Create Post"
              onClick={() => history.push("/new-posting")}
              className="border-2 border-black  mb-4 p-1 rounded-md"
            />

            {postingData.map((post) => (
              <SmallPosting posting={post} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
