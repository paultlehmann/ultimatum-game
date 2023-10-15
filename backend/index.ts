import express, { Express, Request, Response } from "express";
import { Pool } from "pg";

const app: Express = express();
const port = 5432;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port,
});

const getTestData = async () => {
  return await new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM offers ORDER BY id ASC", (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results) {
        // console.log('results',results)
        console.log("results.rows", results.rows);
        resolve(results.rows);
      }
    });
  });
};

// const getTestData = () => {
//     return new Promise(function(resolve, reject) {
//       pool.query('SELECT * FROM offers ORDER BY id ASC', (error, results) => {
//         if (error) {
//           reject(error)
//         }
//         resolve(results.rows);
//       })
//     })
//   }

// const getTestData = async () => {
//     await pool.query('SELECT * FROM offers ORDER BY id ASC').then((result: any) => console.log('result',result))
// }

//   console.log('getTestData',(async () => await getTestData())())

// const passthrough = async () => await getTestData()
// async () => await passthrough().then((rez: any) => console.log('rez',rez))

getTestData();
