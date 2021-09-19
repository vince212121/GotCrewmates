import Axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { BASE_URL } from "../../Constants";
import Cookies from "js-cookie";

const Tag = ({ name }) => (
  <div className="p-1 background bg-lightlightblue rounded-lg">{name}</div>
);

const TagSearchBar = ({ tags, setTags }) => {
  const history = useHistory();
  const location = useLocation();
  let lastQuery = undefined;
  const uniqueTags = new Set();

  const [matchingTags, setMatchingTags] = useState(["apple", "orange"]);
  const [token, setToken] = useState();

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (!cookieToken) {
      history.push(`/login?redirect=${location.pathname}`);
    }
    setToken(cookieToken);
  }, []);

  const getMatchingTags = (part) => {
    if (!part) return;
    if (part.includes(lastQuery)) {
      const stillMatch = matchingTags.filter((tag) => tag.includes(part));
      if (stillMatch.length > 5) {
        setMatchingTags(stillMatch);
        return;
      }
    }
    Axios.get(BASE_URL + "/api/tags", {
      params: { searchParameter: part },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setMatchingTags(data.data.reverse());
        lastQuery = part;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateTags = (e,force=false) => {
    const text = e.target.value.toLowerCase();
    const parts = text.split(/\s+/);
    if (parts.length !== 0) getMatchingTags(parts[parts.length - 1]);
    if (!force && !text.match(/\s+$/)) return;
    let resultingString = e.target.value;
    parts.forEach((value) =>
      matchingTags.forEach((tag) => {
        const tagName = tag.tagname.toLowerCase();
        if (tagName === value) {
          resultingString = resultingString.replace(
            new RegExp(`${tagName}\\s*`, "i"),
            ""
          );
          if (!uniqueTags.has(tag.tagname)) {
            uniqueTags.add(tag.tagname);
            setTags(tags.concat([tag]));
          }
        }
      })
    );
    setMatchingTags([]);
    lastQuery = "";
    e.target.value = resultingString;
  };

  const onKey = (e) => {
    console.log(e.target.selectionStart);
    // Backspace
    if (e.keyCode === 8 && e.target.selectionStart === 0) {
      if (tags.length === 0) return;
      const lastTag = tags[tags.length - 1];
      uniqueTags.delete(lastTag.tagName);
      setTags(tags.slice(0, -1));
    }else if(e.keyCode === 13){
      updateTags(e,true);
    }
  };

  return (
      <>
    <div className="bg-white p-1 my-2 flex relative">
      <div className="float-left flex flex-row gap-x-1">
        {tags.map((tag) => (
          <Tag name={tag.tagname} />
        ))}
      </div>
      <input
        name="tags"
        onChange={updateTags}
        onKeyDown={onKey}
        className="searchbar p-1 flex flex-auto "
      />
      <div className="autocomplete hidden bg-white">
        {matchingTags.slice(0, 5).map((tag) => (
          <div>{tag.tagname}</div>
        ))}
      </div>
    </div>
    <style jsx>
        {`
          .searchbar:focus + .autocomplete {
            display: block;
            position: absolute;
            top: 100%;
            left: 0px;
          }

        `}
      </style>
    </>
  );
};

export default TagSearchBar;
