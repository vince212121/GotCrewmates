import Axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
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
      setUserData(data.data);
      setLoading(false);
    });
  });
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-4xl text-white mb-4 border-b-2">
            {userData.username}
          </h1>
          <div className="text-white border border-black rounded-xl p-4">
            {userData}
          </div>
        </>
      )}
    </>
  );
};

export default User;
