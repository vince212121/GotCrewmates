import { useState } from "react";
import Axios from "axios";
import { BASE_URL } from "../Constants";
import { Link } from "react-router-dom";

const SearchBar = ({ searchs, posts }) => {
  const [searchBar, setSearchBar] = useState("");
  const [searchData, setSearchData] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    Axios.get(BASE_URL + "/api/posting", {
      queryParamenter: searchBar,
    }).them((info) => setSearchData(info.data));
  };

  return (
    <div>
      <div className="search"></div>
      <form onSubmit={handleSearch}>
        <div className="input">
          <input
            onChange={({ target: { value } }) => setSearchBar(value)}
            value={searchBar}
            type="text"
            placeholder={posts}
          />
          <div className="Results">
            {searchData.map((posting) => {
              return (
                <Link to={BASE_URL + "/posting/" + posting.postID}>
                  {posting.title}
                </Link>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};
export default SearchBar;
