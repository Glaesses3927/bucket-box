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
    multipleStatements: true,
  });
  
  app.get('/v1', async (req, res) => {
    try {
      const user_id = req.auth.payload.sub;
      let [tables] = await pool.query(
        "SELECT * FROM `User` WHERE userid = :user_id;"
      , { user_id });
      if(tables.length == 0){
        const updateerr = new Error('No Row changed');
        const newTableId = new Date().getTime().toString(16) + Math.floor(1000*Math.random()).toString(16);
        const [result] = await pool.query(
          `INSERT INTO \`User\` (userid, tableid) VALUES ('${user_id}', '${newTableId}');
          CREATE TABLE \`${newTableId}\` ( id int(11) NOT NULL, title varchar(256) NOT NULL, description varchar(1024) NOT NULL, due_date date NOT NULL, location varchar(1024) NOT NULL, url varchar(1024) NOT NULL, completed tinyint(1) NOT NULL DEFAULT 0, created_at timestamp NOT NULL DEFAULT current_timestamp(), tableid varchar(64) NOT NULL DEFAULT '${newTableId}' ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
          ALTER TABLE \`${newTableId}\` ADD PRIMARY KEY (id);
          ALTER TABLE \`${newTableId}\` MODIFY id int(11) NOT NULL AUTO_INCREMENT;
          INSERT INTO \`TableNameId\` (tableid, tablename) VALUES ('${newTableId}', 'FirstTable');`
        );
        if(result.affectedRows == 0) throw updateerr; //TODO???
        tables = [{tableid: newTableId}];
      }
      let result = [];
      for (let i=0; i<tables.length; i++) {
        const tableid = tables[i].tableid;
        const [rows] = await pool.query(
          `SELECT * FROM \`${tableid}\`;`
        );
        result.push(...rows);
      }
      res.status(200).json(result);
    } catch (err) {
      console.error("[Error]: GET");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });

  app.get('/v1/tables', async (req, res) => {
    try {
      const user_id = req.auth.payload.sub;
      const [tables] = await pool.query(
        "SELECT * FROM `User` WHERE userid = :user_id;"
      , { user_id });
      const result = await Promise.all(tables.map(async item => {
        const tableid = item.tableid;
        const [resp] = await pool.query(
          "SELECT * FROM `TableNameId` WHERE tableid = :tableid;"
        , { tableid });
        return {tableid: tableid, tablename: resp[0].tablename};
      }));
      res.status(200).json(result);
    } catch (err) {
      console.error("[Error]: GET");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });

  app.post('/v1', async (req, res) => {
    try {
      const updateerr = new Error('No Row changed');
      const datum = req.body;
      const [result] = await pool.query(
        `INSERT INTO \`${datum.tableid}\` SET :datum`
      , { datum });
      if(result.affectedRows == 0) throw updateerr;
      res.status(200).json({ msg: "OK" });
    } catch (err) {
      console.error("[Error]: POST");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });
  
  app.put('/v1', async (req, res) => {
    try {
      const updateerr = new Error('No Row changed');
      const datum = req.body;
      const id = datum.id;
      const [result] = await pool.query(
        `UPDATE \`${datum.tableid}\` SET :datum WHERE id = :id`
      , { datum, id });
      if(result.affectedRows == 0) throw updateerr;
      res.status(200).json({ msg: "OK" });
    } catch (err) {
      console.error("[Error]: PUT");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });
  
  app.delete('/v1', async (req, res) => {
    try {
      const updateerr = new Error('No Row changed');
      const datum = req.body;
      const [result] = await pool.query(
        `DELETE FROM \`${datum.tableid}\` WHERE id = '${datum.id}'`
      );
      if(result.affectedRows == 0) throw updateerr;
      res.status(200).json({ msg: "OK" });
    } catch (err) {
      console.error("[Error]: DELETE");
      console.error(err);
      res.status(500).json({ msg: "NG", error: err });
    }
  });
  
  app.listen(port, () => console.log(`Server running on port ${port} (${process.env.MODE})`));
})();
