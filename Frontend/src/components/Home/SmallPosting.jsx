const SmallPosting = ({ posting }) => {
  return (
    <>
      <h1 className="text-4xl text-white mb-4 border-b-2">{posting.title}</h1>
      <div className="text-white border border-black rounded-xl p-4">
        {posting.postbody}
      </div>
      <div>{posting.creator}</div>
      <div>{posting.numberofspots}</div>
    </>
  );
};

export default SmallPosting;
