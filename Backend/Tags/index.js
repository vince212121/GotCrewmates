const e = require("express");
const express = require("express");
const { TransactionWraper } = require("../DatabaseUtil");
const router = express.Router();

const POST_SQL_STATEMENT = "INSERT INTO gotcrewmates.tags (tagname) VALUES $1;";

// used to GET all tags
// get arguements for text query
router.get("/tags", async (req, res) => {
  try {
    let getSqlStatement = "SELECT * FROM gotcrewmates.tags";

    let userID = req.userID;
    let pageNumber = parseInt(req.query.pageNumber);
    let searchParam = req.query.searchParameter;
    let additionalStatement = "";
    let queryParamenter = [];

    // no access if missing user ID
    if (!userID) {
      res.status(500).send(`INTERNAL SERVER ERROR: Missing user ID`);
      return;
    }

    if (searchParam && pageNumber >= 2) {
        additionalStatement = " WHERE lower(tagname) LIKE $1 OFFSET ($2 * 20) ROWS LIMIT 20";
        searchParam = "%"+ req.query.searchParameter + "%";
        pageNumber -= 1;
        queryParamenter = [searchParam, pageNumber];
    } else if (searchParam) {
        additionalStatement = " WHERE lower(tagname) LIKE $1 LIMIT 20";
        searchParam = "%"+ req.query.searchParameter + "%";
        queryParamenter = [searchParam];
    } else if (pageNumber >= 2) {
        pageNumber -= 1;
        additionalStatement = " OFFSET ($1 * 20) ROWS LIMIT 20";
        queryParamenter = [pageNumber];
    } else if (pageNumber == 1) {
        additionalStatement = " LIMIT 20";
    }
     else if (isNaN(pageNumber) || pageNumber <= 0) {
        res.status(400).send(`Invalid page number`);
        return;
    }

    // used for searching
    // if (searchParam) {
    //   additionalStatement += " WHERE lower(tagname) LIKE $1%";
    //   queryParamenter = [searchParam.toLowerCase()];

    //   console.log("in search param");
    //   console.log("statement: " + getSqlStatement + additionalStatement + ";");
    //   console.log("query " + queryParamenter);
    //   console.log("search: " + searchParam.toLowerCase());

    //   // getting a certian amount of tags at a time
    // //   if (pageNumber >= 2) {
    // //     additionalStatement += " OFFSET ($2 * 20) ROWS";
    // //     queryParamenter = [searchParam.toLowerCase(), pageNumber];

    // //     console.log("in pg number");
    // //     console.log(
    // //       "statement: " + getSqlStatement + additionalStatement + ";"
    // //     );
    // //     console.log("query " + queryParamenter);
    // //     console.log("search: " + searchParam.toLowerCase());
    // //   }
    // } else {
    //   // getting a certian amount of tags at a time
    //   if (isNaN(pageNumber) || pageNumber <= 0) {
    //     res.status(400).send(`Invalid page number`);
    //     return;
    //   } else if (pageNumber >= 2) {
    //     additionalStatement += " OFFSET ($1 * 20) ROWS";
    //     queryParamenter = [pageNumber];
    //   }
    // }

    TransactionWraper((client) =>
      client.query(getSqlStatement + additionalStatement + ";", queryParamenter)
    )
      .then((result) => {
        console.log("made it in");
        console.log(
          "statement: " + getSqlStatement + additionalStatement + ";"
        );
        res.status(200).send(result.rows);
      })
      .catch((e) => {
        console.log(e);
        res.sendStatus(500);
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

// used to POST new tags
router.post("/tags", async (req, res) => {
  try {
    let userID = req.userID;
    let tagName = req.body.tagName;

    if (!userID) {
      res.status(500).send(`INTERNAL SERVER ERROR: Missing user ID`);
      return;
    }

    if (!tagName) {
      res.status(400).send(`Missing tag name`);
      return;
    }

    // TransactionWraper((client) =>
    //   client.query(
    //     POST_SQL_STATEMENT,
    //     queryParamenter
    //   )
    // )
    //   .then((result) => {
    //     if (!postID || result.rows.length > 0) {
    //       res.status(200).send(result.rows);
    //     } else res.sendStatus(400);
    //   })
    //   .catch((e) => {
    //     res.sendStatus(500);
    //   });
  } catch (error) {
    res.sendStatus(500);
  }
});

// getting posts by tag

module.exports = router;
