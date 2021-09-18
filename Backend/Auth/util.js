const bcrypt = require("bcrypt");
const { TransactionWraper } = require("../DatabaseUtil");
const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("./secrets");

const SALT_ROUNDS = 10;
const ACCESS_EXPIRES_IN = "90000";
const REFRESH_EXPIRES_IN = "5184000000";

const GetUserRow = async (username) => {
  const result = await TransactionWraper((client) =>
    client.query("SELECT * FROM gotcrewmates.users WHERE username = $1;", [
      username,
    ])
  );
  if (result.rows.length < 1) {
    return undefined;
  }
  if (result.rows.lenght > 1) {
    console.log(`Oh shit something went terribly wrong: ${username}`);
    return;
  }
  return result.rows[0];
};

const HashPassword = (password) => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

const ComparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const CreateJWTs = (userID, username) => {
  const payload = { userID: userID, username: username };
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  return [accessToken,refreshToken];
};

module.exports = { GetUserRow, HashPassword, ComparePassword, CreateJWTs };
