import Axios from "axios";
import { useState, useEffect } from "react";
import TagSearchBar from "./NewPosting/tagSearchBar";
import { BASE_URL } from "../Constants";
import { useHistory, useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";

const BrowseTags = () => {
  const history = useHistory();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);
  const [tags, setTags] = useState([]);

  const [postings, setPostings] = useState([]);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (!cookieToken) {
      history.push(`/login?redirect=${location.pathname}`);
    }
    setToken(cookieToken);
    // Since it is an empty bracket, it will run the first time
  }, []);

  useEffect(() => {
    setPostings([]);
    if (tags.length === 0 || !token) return;
    // Do something here to query postings and use setPostings to update data
    Axios.get(BASE_URL + "/api/posting", {
      params: { tagID: tags.map((tag) => tag.tagid) },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setPostings(data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // This will run every time the tags array changes
  }, [tags]);

  return (
    <>
      <div className="p-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-2xl pr-4 p-1 flex flex-row items-center"
        >
          Filter Tags
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="30"
            fill="currentColor"
            className="bi bi-chevron-down pt-2"
            viewBox="0 0 16 16"
          >
            {expanded ? (
              <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
            ) : (
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            )}
          </svg>
        </button>
        {expanded && (
          <div className="absolute top-14 right-36 ">
            <div className="bg-lightlightblue px-2 pt-5 pb-1 rounded-lg">
              <TagSearchBar tags={tags} setTags={setTags} />
            </div>
            {postings.length !== 0 && (
              <div className="flex flex-col bg-white rounded-lg py-1">
                {postings.slice(0, 10).map((posting) => (
                  <Link
                    to={`/posting/${posting.postid}`}
                    className="p-2 border-t border-b border-text-700 hover:bg-text-700"
                  >
                    {posting.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default BrowseTags;
