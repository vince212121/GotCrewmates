// const bcrypt = require("bcrypt");
const { TransactionWraper } = require("../DatabaseUtil");
// const jwt = require("jsonwebtoken");

const FindUsername = async (client, row) => {
  return client
    .query("SELECT * FROM gotcrewmates.users WHERE userid = $1;", [
      row.postcreator,
    ])
    .then((result) => {
      if (result.rows.length < 1) {
        return undefined;
      }
      if (result.rows.lenght > 1) {
        console.log(`Oh shit something went terribly wrong: ${username}`);
        return;
      }
      return { ...row, creator: result.rows[0].username };
    });
};

module.exports = { FindUsername };
