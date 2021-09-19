import { useEffect, useState } from "react";
import Axios from "axios";
import { BASE_URL } from "../Constants";
import { Link, useHistory, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const SearchBar = () => {
  const history = useHistory();
  const location = useLocation();

  const [searchData, setSearchData] = useState([]);
  const [token, setToken] = useState();

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (!cookieToken) {
      history.push(`/login?redirect=${location.pathname}`);
    }
    setToken(cookieToken);
  }, []);

  const handleSearch = (e) => {
    if (!e.target.value) return;
    Axios.get(BASE_URL + "/api/posting", {
      params: { searchParameter: e.target.value },
      headers: { Authorization: `Bearer ${token}` },
    }).then((info) => setSearchData(info.data));
  };

  return (
    <>
      <div>
        <div className="searchbar w-full">
          <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              className="searchbar h-full w-full outline-none text-sm text-gray-700 pr-2 focus:outline-none"
              name="search"
              onChange={handleSearch}
              placeholder="Search Posts"
            />
          </div>
        </div>
        {searchData.length !== 0 && (
          <div className="results hidden absolute bg-text-400 w-full rounded-lg py-1 top-full left-0">
            {searchData.map((posting) => {
              return (
                <Link to={`/posting/${posting.postid}`} key={posting.postid}>
                  <div className="p-2 border-t border-b border-text-700 hover:bg-text-700">
                    {posting.title}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <style jsx>
        {`
          .searchbar:focus-within + .results {
            display: block;
          }
          .results:hover {
            display: block;
          }
        `}
      </style>
    </>
  );
};
export default SearchBar;
