const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");
const router = express.Router();

// const POSTID_GET_SQL_STATEMENT =
//   "SELECT postID from gotcrewmates.postings;";
// const POSTINGTAG_POST_SQL_STATEMENT =
//  "INSERT INTO gotcrewmates.postingtags (postID, tagID) VALUES ($1, $2);";

const POST_SQL_STATEMENT =
  "INSERT INTO gotcrewmates.postings (postCreator, title, postBody, numberOfSpots) VALUES ($1, $2, $3, $4);";

const POSTING_TAG_POST_SQL_STATEMENT =
  "INSERT INTO gotcrewmates.postingtags (postID, tagID) VALUES (SELECT postID FROM gotcrewmates.postings WHERE postCreator = $1 AND title,$1);";

const DELETE_SQL_STATEMENT =
  // "DELETE FROM gotcrewmates.postings WHERE postID = $1;";
  "DELETE FROM gotcrewmates.postings WHERE postID = $1 AND postcreator = $2;";

// only of they are logged in, if they are not logged in they will get a 401 for now
// request.userid is user id
// request.username = username

// Getting posts from server
router.get("/posting", async (req, res) => {
  try {
    let postID;
    let pageNumber;
    let postingsSqlStatement =
      // "SELECT u.username, p.title, p.postbody, p.status, p.numberofspots, t.tagname, p.postid, p.datecreated FROM gotcrewmates.tags t JOIN gotcrewmates.postingtags pt ON t.tagid = pt.tagid JOIN gotcrewmates.postings p ON p.postid = pt.postid JOIN gotcrewmates.users u ON p.postcreator = u.userid";
      "SELECT u.username, p.title, p.postbody, p.status, p.numberofspots, t.tagname, p.postid, p.datecreated FROM gotcrewmates.tags t FULL OUTER JOIN gotcrewmates.postingtags pt ON t.tagid = pt.tagid FULL OUTER JOIN gotcrewmates.postings p ON p.postid = pt.postid JOIN gotcrewmates.users u ON p.postcreator = u.userid";

    let additionalStatement = "";
    let queryParamenter = [];

    if (req.query.postID) {
      if (/^\d+$/.test(req.query.postID)) {
        postID = BigInt(req.query.postID);
        additionalStatement += " WHERE p.postID = $1";
        queryParamenter = [postID];
        console.log(queryParamenter);
      } else {
        res.status(400).send(`Invalid postID`);
        return;
      }
    } else {
      pageNumber = parseInt(req.query.pageNumber);
      if (isNaN(pageNumber) || pageNumber <= 0) {
        res.status(400).send(`Invalid page number`);
        return;
      } else if (pageNumber >= 2) {
        additionalStatement += " OFFSET ($1 * 20) ROWS";
        queryParamenter = [pageNumber];
      }
    }

    TransactionWraper((client) =>
      client.query(
        postingsSqlStatement + additionalStatement + ";",
        queryParamenter
      )
    )
      .then((result) => {
        if (!postID || result.rows.length > 0) {
          res.status(200).send(result.rows);
        } else res.sendStatus(400);
      })
      .catch((e) => {
        res.sendStatus(500);
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

//****  Need to fix error with invalid user id giving an UnhandledPromiseRejectionWarning
/*
TODO: 
  - When the tag id array is passed in, it needs to run the insert in the postingTags table 
  - Once the post is created, we need to access the postID then add the tagIDs to the postTags table
  - Change from body to query for GET requests

  Not my problem (this is when you click on join)
  - Then need to add it to the groups table with the post id and member id
 */
// Posting data to server
router.post("/posting", async (req, res) => {
  // gather the data from req
  try {
    let postCreator = req.userID;
    const { title, postBody, tags } = req.body;
    const numberOfSpots = parseInt(req.body.numberOfSpots);

    if (!postCreator) {
      res.status(500).send(`INTERNAL SERVER ERROR: Missing post creator`);
      return;
    }

    if (!title) {
      res.status(400).send(`Invalid title`);
      return;
    }

    if (!postBody) {
      res.status(400).send(`Invalid post body`);
      return;
    }

    if (isNaN(numberOfSpots) || numberOfSpots <= 0) {
      res.status(400).send(`Invalid number of spots`);
      return;
    }

    TransactionWraper((client) =>
      client.query(POST_SQL_STATEMENT, [
        postCreator,
        title,
        postBody,
        numberOfSpots,
      ])
    )
      .then((result) => {
        if (result.rowCount == 1) {
          //res.sendStatus(201);
          // let postID = TransactionWraper((client) => client.query(POSTID_GET_SQL_STATEMENT)).then((result) => {
          // })
          // TransactionWraper((client) => client.query(POSTINGTAG_POST_SQL_STATEMENT, [postID.result, ]))
        } else {
          res.sendStatus(400);
        }
      })
      .catch((e) => {
        // Catch invalid user
        if (e.code === "23503") {
          res.status(400).send("Invalid user");
          return;
        }
        console.error(e);
        res.sendStatus(500);
      });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// using cascade delete
// deleting post from server
router.delete("/posting", async (req, res) => {
  try {
    let postID;
    let userID = req.userID;
    
    if (!userID) {
      res.status(500).send(`INTERNAL SERVER ERROR: Missing User ID`);
      return;
    }

    if (/^\d+$/.test(req.body.postID)) {
      postID = BigInt(req.body.postID);
    } else {
      res.status(400).send(`Invalid PostID`);
      return;
    }
    console.log("user id " + userID)
    console.log("req " + req.userID);

    TransactionWraper((client) => client.query(DELETE_SQL_STATEMENT, [postID, userID]))
      .then((result) => {
        console.log('transaction worked')
        console.log("user id " + userID)
        console.log("req " + req.userID);
        if (result.rowCount === 1) {
          res.status(201).send("Post deleted");
        } else {
          res.status(400).send("Invalid post");
          return;
        }
      })
      .catch((e) => {
        // Catch invalid post
        if (e.code === "23503") {
          res.status(400).send("Invalid postID");
          return;
        }
        console.error(e);
        res.sendStatus(500);
      });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
