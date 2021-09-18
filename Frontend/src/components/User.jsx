import Axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Constants";
import Loading from "./Loading";

const User = () => {
  const { username } = useParams();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    Axios.get(BASE_URL + "/api/user", {
      params: { username: username },
    }).then((data) => {
      console.log(data.data);
      setUserData(data.data);
      setLoading(false);
    });
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-4xl text-white mb-4 font-bold">
            {userData.username}
          </h1>
          <h2 className="text-2xl text-white border-b-2">Posts</h2>
          {userData.postings.map((posting) => (
            <>
              <Link
                to={`/posting/${posting.postid}`}
                className="text-xl text-white"
              >
                {posting.title}
              </Link>
              <div className="text-white border border-black rounded-xl p-4">
                {posting.postbody}
              </div>
            </>
          ))}
          <h2 className="text-2xl text-white border-b-2">Groups</h2>
          {userData.groups.map((posting) => (
            <>
              <Link
                to={`/posting/${posting.postid}`}
                className="text-xl text-white"
              >
                {posting.title}
              </Link>
              <div className="text-white border border-black rounded-xl p-4">
                {posting.postbody}
              </div>
            </>
          ))}
        </>
      )}
    </>
  );
};

export default User;
