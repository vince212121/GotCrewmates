import { useState, useEffect } from "react";
import Axios from "axios";
import { BASE_URL } from "../Constants";
import { useHistory, useLocation,Link } from "react-router-dom";
import Cookies from "js-cookie";

const SearchBar = ({ searchs, posts }) => {
  const history = useHistory();
  const location = useLocation();

  const [searchBar, setSearchBar] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [token, setToken] = useState();

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (!cookieToken) {
      history.push(`/login?redirect=${location.pathname}`);
    }
    setToken(cookieToken);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    Axios.get(BASE_URL + "/api/posting", {
     params:{queryParamenter: searchBar,
              pageNumber : 1},
      headers: { Authorization: `Bearer ${token}` },
    }).then((info) => setSearchData(info.data));
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
          <div className="Results flex flex-col">
            {searchData.map((posting) => {
              return (
                <Link to={`/posting/${posting.postid}`}>
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
