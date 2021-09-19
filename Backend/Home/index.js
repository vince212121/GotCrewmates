const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");

const router = express.Router();
const CREATE_POSTING_TAGS_SQL_STATEMENT =
"INSERT INTO gotcrewmates.postingtags (PostID, TagId) VALUES ($1, $2);"

const CREATE_TAG_SQL_STATEMENT =
"INSERT INTO gotcrewmates.tags (TagName) VALUES ($1);"

const CREATE_POSTS_SQL_STATEMENT =
"INSERT INTO gotcrewmates.postings (PostCreator, Title, PostBody, NumberofSpots) VALUES ($1, 'Title', 'Body', 10);"

//Only gets active posts with the tag.
const FIND_POSTS_SQL_STATEMENT =
  "SELECT p.datecreated, p.postid, p.title, p.postcreator, p.postbody, p.numberofspots, p.status FROM gotcrewmates.tags u JOIN gotcrewmates.postingtags g ON u.TagID = g.TagID JOIN gotcrewmates.postings p ON p.postID = g.postID WHERE u.TagName = $1 and p.status = 1 ORDER BY p.datecreated DESC;";

router.get("/searchs", async (req, res) => {
  const {tagname} = req.body;
  TransactionWraper((client) =>
    client.query(FIND_POSTS_SQL_STATEMENT, [tagname])
  ).then((posts) => {
    console.log(posts.rows)
    if(posts.rows.length > 0) {
        //Send information.
        res.status(200).send(posts.rows)
        
    }   
    else{
        // tag dne, or no posts.
        res.status(400).send("There are no posts with this tag.")
    }
  });
});


module.exports = router;
