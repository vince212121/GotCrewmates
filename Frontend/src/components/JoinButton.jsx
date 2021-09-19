import { useState, useEffect } from "react";
import Axios from "axios";
import { BASE_URL } from "../Constants";
import { useHistory, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const JoinButton = ({ post }) => {
  const history = useHistory();
  const location = useLocation();
  const [buttonData, setButtonData] = useState([]);
  const [token, setToken] = useState();
  const [text, setText] = useState("Join Group");
  const [disabled,setDisabled] = useState(false);

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (!cookieToken) {
      history.push(`/login?redirect=${location.pathname}`);
    }
    setToken(cookieToken);
  }, []);

  const onClick = (e) => {
    console.log(e);
    setDisabled(false);
    setText("Waiting...");
    Axios.post(
      BASE_URL + "/api/postdetails/",
      {
        postID: post.postid,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((info) => {
        setButtonData(info.data);
        setText("Joined group");
        setDisabled(true);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          setDisabled(true);
        }
      });
  };
  return (
    <>
      <div>
        <button
          className="click-change px-2 rounded bg-btn-50 disabled:opacity-50"
          onClick={onClick}
          disabled={disabled}
        >
          {text}
        </button>
      </div>
    </>
  );
};
export default JoinButton;
