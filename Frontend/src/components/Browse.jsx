import Axios from "axios";
import { useState, useEffect } from "react";
import TagSearchBar from "./NewPosting/tagSearchBar";
import { BASE_URL } from "../Constants";
import { useHistory, useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";

const BrowseTags = () => {
  const [expanded, setExpanded] = useState(false);
  const [tags, setTags] = useState([]);

  const [postings, setPostings] = useState([]);
  const [token, setToken] = useState();

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    setToken(cookieToken);
    // Since it is an empty bracket, it will run the first time
  }, []);

  useEffect(() => {
    console.log("Run query")
    setPostings([])
    if(!tags) return;
    // Do something here to query postings and use setPostings to update data
    Axios.get(BASE_URL + "/api/posting", {
      params: { tagID: tags.map((tag)=>tag.tagid)},
      headers: { Authorization: `Bearer ${token}` },
    }).then((data) => {
      console.log(data.data);
      setPostings(data.data);
    });

    // This will run every time the tags array changes
  }, [tags]);


  return (
    <>
      <div className="p-1">
        <button onClick={() => setExpanded(!expanded)} className="text-2xl">
          Show More
        </button>
        {expanded && (
          <div className="absolute">
            <TagSearchBar tags={tags} setTags={setTags} />
            {/* Get a list of clickable tags here */}
            {/* Query the tags */}
            {/* Use the postings use state thing here to make them clickable in another function? */}

            <div className="flex flex-col">
                {postings.map((posting) => (
                  <Link
                    to={`/posting/${posting.postid}`}
                    className="text-xl text-white"
                  >
                    {posting.title}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default BrowseTags;
