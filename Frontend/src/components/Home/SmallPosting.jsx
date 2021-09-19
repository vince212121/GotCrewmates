import { Link } from "react-router-dom";
import Tag from "../Tag";

const SmallPosting = ({ posting }) => {
  console.log(posting);
  return (
    <>
      <Link
        to={`/posting/${posting.postid}`}
        className="text-4xl text-white mb-4 border-b-2"
      >
        {posting.title}
      </Link>
      <div className="text-white border border-black rounded-xl mt-4 px-4 py-2 mb-8">
        <div className="text-2xl">{posting.postbody}</div>

        <div>Number of Spots: {posting.numberofspots}</div>
        <div>Posted by: {posting.username}</div>
        <div className="flex flex-row gap-x-2">
          {posting.tagname.map((tag) => (
            <Tag name={tag} key={tag} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SmallPosting;
