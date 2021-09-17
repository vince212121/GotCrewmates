const { parse } = require("pg-connection-string");
const { Client } = require("pg");

let client;

const GetDBClient = () => {
  return client;
};

(async () => {
  var config = parse("postgresql://root@localhost:26257?sslmode=disable");
  config.port = 26257;
  config.database = "defaultdb";
  client = new Client(config);

  // Connect to database
  try {
    await client.connect();
    console.log("Successfully connected to DB.");
  } catch (err) {
    console.log(`error connecting: ${err}`);
  }
})();

const TransactionWraper = async (operation) => {
  await client.query("BEGIN;");
  let n = 0;
  while (n <= 15) {
    n++;
    if (n === 15) {
      throw new Error("Max retry count reached.");
    }
    try {
      const promise = operation(client);
      await client.query("COMMIT;");
      return promise;
    } catch (err) {
        console.log("Transaction failed. Retrying transaction.");
        console.log(err.message);
        await client.query("ROLLBACK;", () => {
          console.log("Rolling back transaction.");
        });
        await new Promise((r) => setTimeout(r, 2 ** n * 1000));
      }
    }
};

const printCallback = (err, res) => {
  if (err) throw err;
  if (res.rows.length > 0) {
    console.log("Rows:");
    res.rows.forEach((row) => {
      console.log(row);
    });
  }
};

module.exports = { GetDBClient, TransactionWraper, printCallback };
