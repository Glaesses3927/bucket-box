import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors"; 
import { createSSHTunnelToMySQLPort } from "./createSSHTunnelToMySQLPort.js";
import { auth } from "express-oauth2-jwt-bearer";

dotenv.config();
const app = express();
const port = 3000;
const sqlHost = process.env.sqlHost;
const sqlUser = process.env.sqlUser;
const sqlPassword = process.env.sqlPassword;
const sqlDatabase = process.env.sqlDatabase;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://glaesses.net', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [ 'Content-Type', 'authorization' ],
}));
app.use( auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
}));

(async () => {
  if(process.env.MODE==="dev"){
    try {
      await createSSHTunnelToMySQLPort();
    } catch (error) {
      console.error("[Error]: SSH");
      console.error(error);
    }
  }

  const pool = mysql.createPool({
    host: sqlHost,
    user: sqlUser,
    password: sqlPassword,
    database: sqlDatabase,
    namedPlaceholders: true,
    dateStrings: 'date',
  });
  
  app.get('/test', async (req, res) => {
    try {
      const [result] = await pool.query(
        "SELECT * FROM test"
      );
      res.status(200).json(result);
    } catch (err) {
      console.error("[Error]: GET");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });

  app.post('/test', async (req, res) => {
    try {
      const datum = req.body;
      await pool.query(
        "INSERT INTO test SET :datum"
      , { datum });
      res.status(200).json({ msg: "OK" });
    } catch (err) {
      console.error("[Error]: POST");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });
  
  app.put('/test', async (req, res) => {
    try {
      const datum = req.body;
      const id = datum.id;
      await pool.query(
        "UPDATE test SET :datum WHERE id = :id"
      , { datum, id });
      res.status(200).json({ msg: "OK" });
    } catch (err) {
      console.error("[Error]: PUT");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });
  
  app.delete('/test', async (req, res) => {
    try {
      const id = req.body.id;
      await pool.query(
        "DELETE FROM test WHERE id = :id"
      , { id });
      res.status(200).json({ msg: "OK" });
    } catch (err) {
      console.error("[Error]: DELETE");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });
  
  app.listen(port, () => console.log(`Server running on port ${port} (${process.env.MODE})`));
})();
