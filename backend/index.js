import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv"; 
import { createSSHTunnelToMySQLPort } from "./createSSHTunnelToMySQLPort.js";

dotenv.config();
const app = express();
const port = 3000;
const sqlHost = process.env.sqlHost;
const sqlUser = process.env.sqlUser;
const sqlPassword = process.env.sqlPassword;
const sqlDatabase = process.env.sqlDatabase;

(async () => {
  try {
    await createSSHTunnelToMySQLPort();
  } catch (error) {
    console.log("Error in SSH");
    console.log(error);
  }
  const pool = mysql.createPool({
    host: sqlHost,
    user: sqlUser,
    password: sqlPassword,
    database: sqlDatabase,
    namedPlaceholders: true,
  });
  
  app.get('/test', async (req, res) => {
    try {
      const [result] = await pool.query(
        "SELECT * FROM test"
      );
      res.json(result);
    } catch (error) {
      console.log("Error in Database");
      console.log(error);
      res.json({ error: "ERROR"});
    }
  });
  
  app.listen(port, () => console.log(`Server running on port ${port}`));
})();
