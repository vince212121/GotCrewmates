import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { BASE_URL } from "../../Constants";
import TagSearchBar from "./tagSearchBar";
import Axios from "axios";
import Cookies from "js-cookie";

const NewPosting = () => {
  const history = useHistory();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [numberOfSpots, setNumberOfSpots] = useState("4");
  const [tags, setTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [token, setToken] = useState();

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (!cookieToken) {
      history.push(`/login?redirect=${location.pathname}`);
    }
    setToken(cookieToken);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(
      BASE_URL + "/api/posting",
      {
        title: title,
        postBody: body,
        tags: tags.map((tag) => tag.tagid),
        numberOfSpots: numberOfSpots,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        const {postID} = res.data;
        history.push(`/posting/${postID}`);
      })
      .catch((err) => {
        if (err.status === 401) setErrorMessage("Username already exists");
        if (err.status >= 500 && err.status < 600)
          setErrorMessage("Internal server error");
      });
  };

  return (
    <>
      <h1 className="text-2xl text-white">New Posting</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="text-1xl text-white">Title</h2>
        <input
          name="title"
          placeholder="Title"
          value={title}
          onChange={({ target: { value } }) => setTitle(value)}
          className="mb-2"
        />
        <h2 className="text-1xl text-white">Post Body</h2>
        <textarea
          name="postBody"
          placeholder="Post Body"
          value={body}
          onChange={({ target: { value } }) => setBody(value)}
          className="mb-2"
        />
        <h2 className="text-1xl text-white">Total Size of Group</h2>
        <input
          name="numberOfSpots"
          value={numberOfSpots}
          onChange={({ target: { value } }) =>
            setNumberOfSpots(
              Math.max(parseInt(value.replace(/[^\d]/g, "") || 0), 0)
            )
          }
          className="mb-2"
        />
        <h2 className="text-1xl text-white">Tags</h2>
        <TagSearchBar tags={tags} setTags={setTags} />
        {errorMessage}
        <input className="mt-2" type="submit" />
      </form>
    </>
  );
};

export default NewPosting;
