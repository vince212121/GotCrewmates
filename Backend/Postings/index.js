const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");
const router = express.Router();

const POST_SQL_STATEMENT =
  "INSERT INTO gotcrewmates.postings (postCreator, title, postBody, numberOfSpots) VALUES ($1, $2, $3, $4) RETURNING postid;";

const POSTING_TAG_POST_SQL_STATEMENT =
  "INSERT INTO gotcrewmates.postingtags (postID, tagID) VALUES ( $1, $2);";

const DELETE_SQL_STATEMENT =
  "DELETE FROM gotcrewmates.postings WHERE postID = $1 AND postcreator = $2;";

// Getting posts from server
// or getting posts by tag
router.get("/posting", async (req, res) => {
  try {
    let postID;
    let tagID;
    let pageNumber;
    let postingsSqlStatement =
      "SELECT u.username, p.title, p.postbody, p.status, p.numberofspots, t.tagname, p.postid, p.datecreated FROM gotcrewmates.tags t FULL OUTER JOIN gotcrewmates.postingtags pt ON t.tagid = pt.tagid FULL OUTER JOIN gotcrewmates.postings p ON p.postid = pt.postid JOIN gotcrewmates.users u ON p.postcreator = u.userid";

    let additionalStatement = "";
    let queryParamenter = [];

    if (req.query.postID) {
      // filter by post
      if (/^\d+$/.test(req.query.postID)) {
        postID = BigInt(req.query.postID);
        additionalStatement += " WHERE p.postID = $1 LIMIT 20";
        queryParamenter = [postID];
      } else {
        res.status(400).send(`Invalid postID`);
        return;
      }
    } else if (req.query.tagID) {
      // filter by tag
      if (/^\d+$/.test(req.query.tagID)) {
        tagID = BigInt(req.query.tagID);
        additionalStatement += " WHERE pt.tagID = $1 LIMIT 20";
        queryParamenter = [tagID];
      } else {
        res.status(400).send(`Invalid tagID`);
        return;
      }
    } else {
      // page number
      pageNumber = parseInt(req.query.pageNumber);
      if (isNaN(pageNumber) || pageNumber <= 0) {
        res.status(400).send(`Invalid page number`);
        return;
      } else if (pageNumber >= 2) {
        pageNumber -= 1;
        additionalStatement += " OFFSET ($1 * 20) ROWS LIMIT 20";
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

    if (!tags) {
      res.status(400).send("Missing tags");
      return;
    }

    if (!title) {
      res.status(400).send("Invalid title");
      return;
    }

    if (!postBody) {
      res.status(400).send("Invalid post body");
      return;
    }

    if (isNaN(numberOfSpots) || numberOfSpots <= 0) {
      res.status(400).send("Invalid number of spots");
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
      .then(async (result) => {
        if (result.rowCount == 1) {
          const postID = BigInt(result.rows[0].postid);
          const promises = await TransactionWraper((client) =>
            tags.map((tag) =>
              client.query(POSTING_TAG_POST_SQL_STATEMENT, [
                postID,
                BigInt(tag),
              ])
            )
          );
          Promise.all(promises).then(() => res.status(201).send(postID.toString()));
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

    TransactionWraper((client) =>
      client.query(DELETE_SQL_STATEMENT, [postID, userID])
    )
      .then((result) => {
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
