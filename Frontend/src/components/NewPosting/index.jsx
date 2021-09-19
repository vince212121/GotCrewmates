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
    setErrorMessage("");
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
        const { postID } = res.data;
        history.push(`/posting/${postID}`);
      })
      .catch((err) => {
        if (err.response.status === 400) setErrorMessage("Invalid Posting");
        if (err.response.status >= 500 && err.status < 600)
          setErrorMessage("Internal server error");
      });
  };

  return (
    <>
      <h1 className="text-4xl text-white font-bold border-b-2 mb-2">
        New Posting
      </h1>
      <div className="text-red text-2xl">{errorMessage}</div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="text-2xl text-white">Title*</h2>
        <input
          name="title"
          placeholder="Title"
          value={title}
          onChange={({ target: { value } }) => setTitle(value)}
          className="mb-4 p-1 rounded-md"
        />
        <h2 className="text-2xl text-white">Post Body*</h2>
        <textarea
          name="postBody"
          placeholder="Post Body"
          value={body}
          onChange={({ target: { value } }) => setBody(value)}
          className="mb-4 p-1 rounded-md"
        />
        <h2 className="text-2xl text-white rounded-md">Total Size of Group*</h2>
        <input
          name="numberOfSpots"
          value={numberOfSpots}
          onChange={({ target: { value } }) =>
            setNumberOfSpots(
              Math.max(parseInt(value.replace(/[^\d]/g, "") || 0), 0)
            )
          }
          className="mb-4 w-1/2 p-1 rounded-md"
        />
        <h2 className="text-2xl text-white">Tags*</h2>
        <TagSearchBar tags={tags} setTags={setTags} />
        <input
          className="mt-2 py-2 w-1/3 left-auto bg-text-700 rounded-md"
          type="submit"
          value="Make Posting"
        />
      </form>
    </>
  );
};

export default NewPosting;
